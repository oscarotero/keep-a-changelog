/**
 * Temporary URLPattern shim
 * @see https://github.com/denoland/dnt/issues/336
 */
class URLPatternShim {
  private readonly pattern: RegExp;

  constructor(pattern: string | RegExp) {
    if (typeof pattern === "string") {
      pattern = pattern.replace(/\*/g, ".*");
      pattern = new RegExp(`^${pattern}$`);
    }

    this.pattern = pattern;
  }

  test(url: string): boolean {
    return this.pattern.test(url);
  }
}

export interface Settings {
  pattern: URLPatternShim;
  tagLink: (url: string, tag: string, previous?: string, head?: string) => string;
  head: string;
}

export default function getSettingsForURL(url: string): Settings | undefined {
  return settings.find((settings) => settings.pattern.test(url));
}

export const settings: Settings[] = [
  {
    pattern: new URLPatternShim("https://github.com/*"),
    head: "HEAD",
    tagLink(url, tag, previous) {
      if (!previous) {
        return `${url}/releases/tag/${tag}`;
      }

      return `${url}/compare/${previous}...${tag}`;
    },
  },
  {
    pattern: new URLPatternShim("https://gitlab.*/*"),
    head: "master",
    tagLink(url, tag, previous) {
      if (!previous) {
        return `${url}/-/tags/${tag}`;
      }

      return `${url}/-/compare/${previous}...${tag}`;
    },
  },
  {
    pattern: new URLPatternShim("https://dev.azure.com/*"),
    head: "master",
    tagLink(url, tag, previous, head) {
      if (!previous) {
        return `${url}?version=GT${tag}`;
      }

      let tagPrefix = "GT";

      if (tag === head) {
        tagPrefix = "GB";
      }

      return `${url}/branchCompare?baseVersion=GT${previous}&targetVersion=${tagPrefix}${tag}`;
    },
  },
];
