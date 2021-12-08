import { Release, Change } from "../../mod.ts";
import { Semver } from "../../src/deps.ts";

class CustomRelease extends Release {
  constructor(version?: Semver | string, date?: Date | string, description?: string) {
    super(version, date, description);
    this.changes.set("maintenance", []);
  }
  maintenance(change: string | Change) {
    return this.addChange("maintenance", change);
  }
}

export default function (version?: Semver | string, date?: Date | string, description?: string) {
  return new CustomRelease(version, date, description);
}
