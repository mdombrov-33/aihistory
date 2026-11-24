// Enforces readable blank lines using the installed TypeScript parser; Oxfmt owns other formatting.
const { readFile, readdir, writeFile } = require("node:fs/promises");
const path = require("node:path");
const ts = require("typescript");

/** Add spacing between statement groups without changing tokens, comments or import order.
 * @param {string} text
 * @param {string} filename
 * @returns {string}
 */
function spaceSource(text, filename) {
  const source = ts.createSourceFile(filename, text, ts.ScriptTarget.Latest, true);

  if (source.parseDiagnostics.length) {
    throw new Error(`Cannot apply spacing to invalid syntax: ${filename}`);
  }

  const lines = text.split(/\r?\n/);
  const newline = text.includes("\r\n") ? "\r\n" : "\n";
  const breaks = new Set();
  const lineAt = (position) => source.getLineAndCharacterOfPosition(position).line;
  const start = (node) => lineAt(node.getStart(source));
  const end = (node) => lineAt(node.end - 1);
  const imports = (node) => ts.isImportDeclaration(node) || ts.isImportEqualsDeclaration(node);
  const directive = (node) => ts.isExpressionStatement(node) && ts.isStringLiteral(node.expression);
  const short = (node) => start(node) === end(node);
  const control = (node) =>
    ts.isIfStatement(node) ||
    ts.isIterationStatement(node, false) ||
    ts.isSwitchStatement(node) ||
    ts.isTryStatement(node);
  const declaration = (node) =>
    ts.isFunctionDeclaration(node) ||
    ts.isClassDeclaration(node) ||
    ts.isInterfaceDeclaration(node) ||
    ts.isTypeAliasDeclaration(node) ||
    ts.isEnumDeclaration(node);

  function blankBefore(line) {
    if (line > 0 && lines[line - 1].trim()) breaks.add(line);
  }

  function needsSpace(previous, current) {
    if (imports(previous) && imports(current)) return false;
    if (directive(previous) && directive(current)) return false;
    if (imports(previous) || imports(current) || directive(previous)) return true;
    if (declaration(previous) || declaration(current)) return true;
    if (
      control(previous) ||
      control(current) ||
      ts.isReturnStatement(current) ||
      ts.isThrowStatement(current)
    )
      return true;
    if (ts.isVariableStatement(previous) && ts.isVariableStatement(current)) {
      return !short(previous) || !short(current);
    }

    return ts.isVariableStatement(previous) !== ts.isVariableStatement(current);
  }

  function separate(statements) {
    for (let index = 1; index < statements.length; index++) {
      const previous = statements[index - 1];
      const current = statements[index];
      if (!needsSpace(previous, current) || start(current) <= end(previous)) continue;

      // Keep JSDoc and explanatory comments attached to the statement they describe.
      const comments = ts.getLeadingCommentRanges(text, current.pos) ?? [];
      const leading = comments.find((comment) => lineAt(comment.pos) > end(previous));
      blankBefore(leading ? lineAt(leading.pos) : start(current));
    }
  }

  function visit(node) {
    if (
      ts.isSourceFile(node) ||
      ts.isBlock(node) ||
      ts.isModuleBlock(node) ||
      ts.isCaseClause(node) ||
      ts.isDefaultClause(node)
    )
      separate(node.statements);

    ts.forEachChild(node, visit);
  }

  visit(source);

  // Separate a plain module-purpose comment from the first import; leave JSDoc untouched.
  const first = source.statements.find((statement) => !directive(statement));
  if (first && imports(first)) {
    const comments = ts.getLeadingCommentRanges(text, first.pos) ?? [];
    const last = comments.at(-1);
    if (last?.kind === ts.SyntaxKind.SingleLineCommentTrivia && lineAt(last.end) < start(first)) {
      blankBefore(start(first));
    }
  }

  return lines.map((line, index) => `${breaks.has(index) ? newline : ""}${line}`).join(newline);
}

async function main() {
  const root = path.resolve(__dirname, "..");
  const write = process.argv.includes("--write");
  const check = process.argv.includes("--check");
  if (write === check) throw new Error("Use exactly one of --write or --check");

  async function sources(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const nested = await Promise.all(
      entries.map((entry) => {
        const file = path.join(directory, entry.name);
        if (entry.isDirectory()) return sources(file);
        return /\.(ts|tsx)$/.test(entry.name) &&
          !entry.name.endsWith(".d.ts") &&
          !file.startsWith(path.join(root, "src/components/ui/"))
          ? [file]
          : [];
      }),
    );

    return nested.flat();
  }

  const files = [
    ...(await sources(path.join(root, "src"))),
    ...(await sources(path.join(root, "tests"))),
    path.join(root, "next.config.ts"),
    path.join(root, "playwright.config.ts"),
  ].sort();
  const changed = [];

  for (const file of files) {
    const before = await readFile(file, "utf8");
    const after = spaceSource(before, file);
    if (before === after) continue;

    changed.push(path.relative(root, file));
    if (write) await writeFile(file, after);
  }

  if (check && changed.length) {
    process.stderr.write(
      `Blank-line spacing needs formatting:\n${changed.map((file) => `  ${file}`).join("\n")}\nRun make format.\n`,
    );
    process.exitCode = 1;
  } else {
    process.stdout.write(
      `Blank-line spacing ${write ? "applied" : "checked"}: ${files.length} files, ${changed.length} changed.\n`,
    );
  }
}

module.exports = { spaceSource };

if (require.main === module) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
