import z from "zod";

// biome-ignore lint/suspicious/noExplicitAny: need this to be unsafe
export type TrustMe = any;

export const snapshotSchema = z.object({
  tables: z.record(
    z.string(),
    z.object({
      name: z.string(),
      columns: z.record(
        z.string(),
        z.object({
          name: z.string(),
        }),
      ),
      foreignKeys: z.record(
        z.string(),
        z.object({
          tableTo: z.string(),
          columnsFrom: z.array(z.string()),
          columnsTo: z.array(z.string()),
        }),
      ),
    }),
  ),
});
export type Snapshot = z.TypeOf<typeof snapshotSchema>;

export const enum RelationType {
  ONE = 0,
  MANY = 1,
}

export type Relation =
  | {
      toTable: string;
      type: RelationType.ONE;
      columnsFrom: string[];
      columnsTo: string[];
    }
  | {
      toTable: string;
      type: RelationType.MANY;
    };

export type TableRelation = {
  table: string;
  relationships: Relation[];
};
