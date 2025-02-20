export default class Change {
  title: string;
  description: string;
  issues: string[] = [];

  static extractIssues(text: string, issues: string[]) {
    return text
      .replace(/(^|[^\\])\[#(\d+)\](?=[^\(]|$)/g, (_, start, index) => {
        if (!issues.includes(index)) {
          issues.push(index);
        }

        return `${start}[#${index}]`;
      })
      .replace(/(^|[\s,])#(\d+)(?=[\s,\.]|$)/g, (_, start, index) => {
        if (!issues.includes(index)) {
          issues.push(index);
        }

        return `${start}[#${index}]`;
      });
  }

  constructor(title: string, description = "") {
    this.title = Change.extractIssues(title, this.issues);
    this.description = Change.extractIssues(description, this.issues);
  }

  toString(bulletStyle = "-") {
    let t = this.title.split("\n").map((line) => `  ${line}`.trimEnd());
    t[0] = bulletStyle + t[0].substr(1);

    if (this.description) {
      t.push("");

      t = t.concat(
        this.description.split("\n").map((line) => `  ${line}`.trimEnd()),
      );
    }

    return t.join("\n").trim();
  }
}
