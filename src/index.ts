#!/usr/bin/env node
import { writeFileSync } from "fs";
import FlagSet, { multiple, string } from "jsflags";
import { parseNodejs } from "jsflags/node";
import { parseSnapshot, parseSrcs } from "./parsing";
import { serializeRelations } from "./serialize";

const flags = new FlagSet();
const snapshotRef = flags.flag(
  string,
  "snapshot",
  "The snapshot file under drizzle/meta to use. (ex. ./drizzle/meta/0000_snapshot.json)",
);
const srcRef = flags.flag(
  multiple(string),
  "src",
  "The paths to the database schema file. (ex. ./path/to/file.ts)",
);
const moduleRef = flags.flag(
  multiple(string),
  "module",
  `The module specifier(s) (ex. "./module/specifier" which would be then used in an import like 'import {} as "./module/specifier"') in the same order as '-src'.`,
);
const outfileRef = flags.flag(
  string,
  "outfile",
  "The location to store the generated typescript file.",
);
parseNodejs(flags);

if (srcRef.value.length === 0) {
  console.error("You must specify at least one database schema file.");
  process.exit(1);
}

if (srcRef.value.length !== moduleRef.value.length) {
  console.error(
    "There should be the same number of module specifiers as there are src files.",
  );
  process.exit(1);
}

const generated = serializeRelations(
  parseSnapshot(snapshotRef.value),
  parseSrcs(srcRef.value),
  moduleRef.value,
);
writeFileSync(outfileRef.value, generated);
