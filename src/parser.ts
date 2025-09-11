import Changelog from "./Changelog.ts";
import Release from "./Release.ts";

export interface Options {
  /**
   * Custom function to create Release instances.
   * Needed if you want to use a custom Release class.
   */
  releaseCreator: (
    version?: string,
    date?: string,
    description?: string,
  ) => Release;
  /**
   * If false, releases will not be sorted automatically.
   * Default is true.
   */
  autoSortReleases: boolean;
}

const defaultOptions: Options = {
  releaseCreator: (version, date, description) =>
    new Release(version, date, description),
  autoSortReleases: true,
};

/** Parse a markdown string */
export default function parser(
  markdown: string,
  options?: Partial<Options>,
): Changelog {
  const opts = Object.assign({}, defaultOptions, options);
  const tokens = tokenize(markdown);

  try {
    return processTokens(tokens, opts);
  } catch (error) {
    throw new Error(
      `Parse error in the line ${tokens[0][0]}: ${(error as Error).message}`,
    );
  }
}

/** Process an array of tokens to build the Changelog */
function processTokens(tokens: Token[], opts: Options): Changelog {
  const changelog = new Changelog("");

  changelog.flag = getContent(tokens, "flag");
  changelog.title = getContent(tokens, "h1", true);
  changelog.description = getTextContent(tokens);
  changelog.autoSortReleases = opts.autoSortReleases;

  //Releases
  let release;

  while ((release = getContent(tokens, "h2").toLowerCase())) {
    const matches = release.match(
      /\[?([^\]]+)\]?\s*-\s*([\d]{4}-[\d]{1,2}-[\d]{1,2})(\s+\[yanked\])?$/,
    );

    if (matches) {
      release = opts.releaseCreator(matches[1], matches[2]);
      release.yanked = !!matches[3];
    } else if (release.includes("unreleased")) {
      const matches = release.match(
        /\[?([^\]]+)\]?\s*-\s*unreleased(\s+\[yanked\])?$/,
      );
      const yanked = release.includes("[yanked]");
      release = matches
        ? opts.releaseCreator(matches[1])
        : opts.releaseCreator();
      release.yanked = yanked;
    } else {
      throw new Error(`Syntax error in the release title`);
    }

    changelog.addRelease(release);
    release.description = getTextContent(tokens);

    let type;

    while ((type = getContent(tokens, "h3").toLowerCase())) {
      let change;

      while ((change = getContent(tokens, "li"))) {
        release.addChange(type, change);
      }
    }
  }

  //Skip release links
  let link = getContent(tokens, "link");

  while (link) {
    if (!changelog.url) {
      const matches = link.match(
        /^\[.*\]\:\s*(http.*?)\/(?:-\/)?(branches\/compare|branchCompare|compare)(\/|\?).*$/,
      );

      if (matches) {
        changelog.url = matches[1];
      }
    }

    link = getContent(tokens, "link");
  }

  //Footer
  if (getContent(tokens, "hr")) {
    changelog.footer = getContent(tokens, "p");
  }

  if (tokens.length) {
    throw new Error(`Unexpected content ${JSON.stringify(tokens)}`);
  }

  return changelog;
}

/** Returns the content of a token */
function getContent(
  tokens: Token[],
  type: TokenType | TokenType[],
  required = false,
): string {
  const types = Array.isArray(type) ? type : [type];

  if (!tokens[0] || types.indexOf(tokens[0][1]) === -1) {
    if (required) {
      throw new Error(`Required token missing in: "${tokens[0][0]}"`);
    }

    return "";
  }

  return tokens.shift()![2].join("\n");
}

/** Return the next text content */
function getTextContent(tokens: Token[]): string {
  const lines: string[] = [];
  const types = ["p", "li"];

  while (tokens[0] && types.indexOf(tokens[0][1]) !== -1) {
    const token = tokens.shift()!;

    if (token[1] === "li") {
      lines.push("- " + token[2].join("\n"));
    } else {
      lines.push(token[2].join("\n"));
    }
  }

  return lines.join("\n");
}

type TokenType = "h1" | "h2" | "h3" | "li" | "p" | "link" | "flag" | "hr";
type Token = [number, TokenType, string[]];

/** Tokenize a markdown string */
function tokenize(markdown: string): Token[] {
  const tokens: Token[] = [];

  markdown
    .trim()
    .split("\n")
    .map((line, index, allLines): Token => {
      const lineNumber = index + 1;

      if (line.startsWith("---")) {
        return [lineNumber, "hr", ["-"]];
      }

      if (line.startsWith("# ")) {
        return [lineNumber, "h1", [line.substr(1).trim()]];
      }

      if (line.startsWith("## ")) {
        return [lineNumber, "h2", [line.substr(2).trim()]];
      }

      if (line.startsWith("### ")) {
        return [lineNumber, "h3", [line.substr(3).trim()]];
      }

      if (line.startsWith("-")) {
        return [lineNumber, "li", [line.substr(1).trim()]];
      }

      if (line.startsWith("*")) {
        return [lineNumber, "li", [line.substr(1).trim()]];
      }

      if (line.match(/^\[.*\]\:\s*http.*$/)) {
        return [lineNumber, "link", [line.trim()]];
      }

      if (line.match(/^\[.*\]\:$/)) {
        const nextLine = allLines[index + 1];
        if (nextLine && nextLine.match(/\s+http.*$/)) {
          // We found a multi-line link: treat it like a single line
          allLines[index + 1] = "";
          return [lineNumber, "link", [
            line.trim() + "\n" + nextLine.trimEnd(),
          ]];
        }
      }

      const result = line.match(/^<!--(.*)-->$/)!;
      if (result) {
        return [lineNumber, "flag", [result[1].trim()]];
      }

      return [lineNumber, "p", [line.trimEnd()]];
    })
    .forEach((line: Token, index: number) => {
      const [lineNumber, type, [content]] = line;

      if (index > 0) {
        const prevType = tokens[0][1];

        if (type === "p") {
          if (prevType === "p") {
            return tokens[0][2].push(content);
          }

          if (prevType === "li") {
            return tokens[0][2].push(content.replace(/^\s\s/, ""));
          }
        }
      }

      tokens.unshift([lineNumber, type, [content]]);
    });

  return tokens
    .filter((token) => !isEmpty(token[2]))
    .map((token) => {
      const content = token[2];

      while (isEmpty(content[content.length - 1])) {
        content.pop();
      }

      while (isEmpty(content[0])) {
        content.shift();
      }

      return token;
    })
    .reverse();
}

/** Check if a string or array is empty */
function isEmpty(val: string | string[]): boolean {
  if (Array.isArray(val)) {
    val = val.join("");
  }

  return !val || val.trim() === "";
}
