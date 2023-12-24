import { RelationType, type Snapshot, type TableRelation } from "./types";

export function relationsFromSnapshot(snapshot: Snapshot): TableRelation[] {
  const tables = Object.values(snapshot.tables);
  const relations: TableRelation[] = [];

  for (const table of tables) {
    relations.push({
      table: table.name,
      relationships: [],
    });
  }

  for (const table of tables) {
    const tableRelation = relations.find((r) => r.table === table.name);
    if (!tableRelation) {
      console.error("This should never happen?");
      continue;
    }
    for (const fkey of Object.values(table.foreignKeys)) {
      const targetTableRelation = relations.find(
        (r) => r.table === fkey.tableTo,
      );
      if (!targetTableRelation) {
        console.error("Couldn't find table with name:", fkey.tableTo);
        continue;
      }
      tableRelation.relationships.push({
        toTable: fkey.tableTo,
        columnsFrom: fkey.columnsFrom,
        columnsTo: fkey.columnsTo,
        type: RelationType.ONE,
      });
      targetTableRelation.relationships.push({
        toTable: table.name,
        type: RelationType.MANY,
      });
    }
  }

  return relations.filter((r) => {
    return r.relationships.length > 0;
  });
}
