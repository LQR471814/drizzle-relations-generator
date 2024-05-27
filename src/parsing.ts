import { readFileSync } from "node:fs";
import { getTableName } from "drizzle-orm";
import { buildSync } from "esbuild";
import { relationsFromSnapshot } from "./transform";
import { type TrustMe, snapshotSchema } from "./types";

export function parseSnapshot(filepath: string) {
  const snapshotFile = readFileSync(filepath, "utf8");
  const snapshot = snapshotSchema.parse(JSON.parse(snapshotFile));
  return relationsFromSnapshot(snapshot);
}

export type TableVariableMappings = {
  variableName: string;
  tableName: string;
}[];

function parseSrc(filepath: string): TableVariableMappings {
  const result = buildSync({
    entryPoints: [filepath],
    bundle: true,
    format: "cjs",
    write: false,
  });
  const loadResult = result.outputFiles?.[0].contents;
  if (!loadResult) {
    console.error("No contents loaded from database schema files.");
    process.exit(1);
  }

  const decoder = new TextDecoder();
  // @ts-expect-error
  globalThis.module = {};
  // biome-ignore lint/security/noGlobalEval: eval is necessary here
  eval(decoder.decode(loadResult));

  const mappings: { variableName: string; tableName: string }[] = [];
  for (const [variableName, tableObject] of Object.entries(
    globalThis.module.exports,
  )) {
    mappings.push({
      tableName: getTableName(tableObject as TrustMe),
      variableName,
    });
  }

  return mappings;
}

export type FileTableVars = {
  filepath: string;
  mappings: TableVariableMappings;
}[];

export function parseSrcs(filepaths: string[]): FileTableVars {
  const mappings: FileTableVars = [];
  for (const filepath of filepaths) {
    mappings.push({
      filepath,
      mappings: parseSrc(filepath),
    });
  }
  return mappings;
}
