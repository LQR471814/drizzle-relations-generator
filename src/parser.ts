import ts from "typescript"
import type { TrustMe } from "./types";

function parseTables(file: ts.SourceFile) {
  const printer = ts.createPrinter()
  for (const statement of file.statements) {
    if (ts.isExportAssignment(statement)) {
      console.log(
        printer.printNode(
          ts.EmitHint.Unspecified,
          (statement as ts.ExportAssignment).expression,
          file
        )
      )
    }
  }
}

function getSourceFiles(tsconfig: TrustMe, file: string): ts.SourceFile[] {
  const files: Map<string, string> = new Map();

  const host: ts.CompilerHost = {
    getSourceFile: (fileName) => {
      const content = files.get(fileName);
      if (content !== undefined) {
        return ts.createSourceFile(fileName, content, ts.ScriptTarget.Latest);
      }
      return undefined;
    },
    getDefaultLibFileName: () => ts.getDefaultLibFilePath(tsconfig),
    writeFile: (fileName, content) => { },
    getCurrentDirectory: () => process.cwd(),
    getCanonicalFileName: (fileName) => fileName,
    getNewLine: () => ts.sys.newLine,
  };

}

