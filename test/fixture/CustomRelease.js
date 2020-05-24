import { Release } from "../../mod.js";

class CustomRelease extends Release {
  constructor(version, date, description) {
    super(version, date, description);

    const newChangeTypes = [["maintenance", []]];

    this.changes = new Map([...this.changes, ...newChangeTypes]);
  }
  maintenance(change) {
    return this.addChange("maintenance", change);
  }
}

export default function (version, date, description) {
  return new CustomRelease(version, date, description);
}
