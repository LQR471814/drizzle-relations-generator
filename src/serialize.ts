import ts from "typescript";
import { FileTableVars, TableVariableMappings } from "./parsing";
import { RelationType, TableRelation } from "./types";

export function serializeRelations(
  tableRelations: TableRelation[],
  tableVarMappings: FileTableVars,
  importSpecifiers: string[],
): string {
  const tableVarFlat: TableVariableMappings = tableVarMappings.flatMap(
    (v) => v.mappings,
  );

  const statements: ts.Statement[] = [];
  statements.push(
    ts.factory.createImportDeclaration(
      undefined,
      ts.factory.createImportClause(
        false,
        undefined,
        ts.factory.createNamedImports([
          ts.factory.createImportSpecifier(
            false,
            undefined,
            ts.factory.createIdentifier("relations"),
          ),
        ]),
      ),
      ts.factory.createStringLiteral("drizzle-orm"),
      undefined,
    ),
  );

  for (let i = 0; i < tableVarMappings.length; i++) {
    const { mappings } = tableVarMappings[i];

    statements.push(
      ts.factory.createImportDeclaration(
        undefined,
        ts.factory.createImportClause(
          false,
          undefined,
          ts.factory.createNamedImports(
            mappings.map((m) =>
              ts.factory.createImportSpecifier(
                false,
                undefined,
                ts.factory.createIdentifier(m.variableName),
              ),
            ),
          ),
        ),
        ts.factory.createStringLiteral(importSpecifiers[i]),
        undefined,
      ),
    );
  }

  for (const table of tableRelations) {
    const currentTableVarName = tableVarFlat.find(
      (m) => m.tableName === table.table,
    )?.variableName;
    if (!currentTableVarName) {
      console.error(
        `Could not find corresponding variable name for "${table}"`,
      );
      continue;
    }

    const relations = table.relationships.map((rel) => {
      const toTable = tableVarFlat.find((m) => m.tableName === rel.toTable);
      if (!toTable) {
        console.error(
          "Could not find corresponding table variable name for relation:",
          rel,
        );
        return;
      }
      const targetVarName = toTable.variableName;

      switch (rel.type) {
        case RelationType.ONE:
          return ts.factory.createPropertyAssignment(
            ts.factory.createIdentifier(targetVarName),
            ts.factory.createCallExpression(
              ts.factory.createIdentifier("one"),
              undefined,
              [
                ts.factory.createIdentifier(targetVarName),
                ts.factory.createObjectLiteralExpression(
                  [
                    ts.factory.createPropertyAssignment(
                      ts.factory.createIdentifier("fields"),
                      ts.factory.createArrayLiteralExpression(
                        rel.columnsFrom.map((column) =>
                          ts.factory.createPropertyAccessExpression(
                            ts.factory.createIdentifier(currentTableVarName),
                            ts.factory.createIdentifier(column),
                          ),
                        ),
                        false,
                      ),
                    ),
                    ts.factory.createPropertyAssignment(
                      ts.factory.createIdentifier("references"),
                      ts.factory.createArrayLiteralExpression(
                        rel.columnsTo.map((column) =>
                          ts.factory.createPropertyAccessExpression(
                            ts.factory.createIdentifier(targetVarName),
                            ts.factory.createIdentifier(column),
                          ),
                        ),
                        false,
                      ),
                    ),
                  ],
                  true,
                ),
              ],
            ),
          );
        case RelationType.MANY:
          return ts.factory.createPropertyAssignment(
            ts.factory.createIdentifier(targetVarName),
            ts.factory.createCallExpression(
              ts.factory.createIdentifier("many"),
              undefined,
              [ts.factory.createIdentifier(targetVarName)],
            ),
          );
      }
    });

    statements.push(
      ts.factory.createVariableStatement(
        [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
        ts.factory.createVariableDeclarationList(
          [
            ts.factory.createVariableDeclaration(
              ts.factory.createIdentifier(`${currentTableVarName}Relations`),
              undefined,
              undefined,
              ts.factory.createCallExpression(
                ts.factory.createIdentifier("relations"),
                undefined,
                [
                  ts.factory.createIdentifier(currentTableVarName),
                  ts.factory.createArrowFunction(
                    undefined,
                    undefined,
                    [
                      ts.factory.createParameterDeclaration(
                        undefined,
                        undefined,
                        ts.factory.createObjectBindingPattern([
                          ts.factory.createBindingElement(
                            undefined,
                            undefined,
                            ts.factory.createIdentifier("one"),
                            undefined,
                          ),
                          ts.factory.createBindingElement(
                            undefined,
                            undefined,
                            ts.factory.createIdentifier("many"),
                            undefined,
                          ),
                        ]),
                        undefined,
                        undefined,
                        undefined,
                      ),
                    ],
                    undefined,
                    ts.factory.createToken(
                      ts.SyntaxKind.EqualsGreaterThanToken,
                    ),
                    ts.factory.createObjectLiteralExpression(
                      relations.filter(
                        (v) => !!v,
                      ) as ts.ObjectLiteralElementLike[],
                      true,
                    ),
                  ),
                ],
              ),
            ),
          ],
          ts.NodeFlags.Const,
        ),
      ),
    );
  }

  const sourceFile = ts.factory.createSourceFile(
    statements,
    ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
    ts.NodeFlags.None,
  );
  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
    removeComments: false,
  });
  return printer.printFile(sourceFile);
}
