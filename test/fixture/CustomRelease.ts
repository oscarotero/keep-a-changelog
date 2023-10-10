import { Change, Release } from "../../mod.ts";
import type { SemVer } from "../../src/deps.ts";

class CustomRelease extends Release {
  constructor(
    version?: SemVer | string,
    date?: Date | string,
    description?: string,
  ) {
    super(version, date, description);
    this.changes.set("maintenance", []);
  }
  maintenance(change: string | Change) {
    return this.addChange("maintenance", change);
  }
}

export default function (
  version?: SemVer | string,
  date?: Date | string,
  description?: string,
) {
  return new CustomRelease(version, date, description);
}
