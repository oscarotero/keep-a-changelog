export interface Settings {
  pattern: URLPattern;
  tagLink: (url: string, tag: string, previous?: string) => string;
  head: string;
}

export default function getSettingsForURL(url: string): Settings | undefined {
  return settings.find((settings) => settings.pattern.test(url));
}

export const settings: Settings[] = [
  {
    pattern: new URLPattern("https://github.com"),
    head: "HEAD",
    tagLink(url, tag, previous) {
      if (!previous) {
        return `${url}/releases/tag/${tag}`;
      }

      return `${url}/compare/${previous}...${tag}`;
    },
  },
  {
    pattern: new URLPattern("https://gitlab.com"),
    head: "master",
    tagLink(url, tag, previous) {
      if (!previous) {
        return `${url}/-/tags/${tag}`;
      }

      return `${url}/-/compare/${previous}...${tag}`;
    },
  },
];
