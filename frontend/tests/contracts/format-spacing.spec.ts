// Verifies that automatic padding stays readable, syntax-safe and stable across repeated formatting.

import { test, expect } from "@playwright/test";
import ts from "typescript";
import { spaceSource } from "../../scripts/format-spacing.cjs";

test("module headers, imports and exported functions are visibly separated", () => {
  const before =
    '"use client";\n// Guest actions.\nimport { save } from "./store";\nexport function first() {\n  save();\n}\nexport function second() {\n  save();\n}\n';

  expect(spaceSource(before, "actions.ts")).toBe(
    '"use client";\n\n// Guest actions.\n\nimport { save } from "./store";\n\nexport function first() {\n  save();\n}\n\nexport function second() {\n  save();\n}\n',
  );
});

test("short declarations stay grouped while control flow and return get breathing room", () => {
  const before =
    "function read() {\n  const first = 1;\n  const second = 2;\n  if (first > second) return false;\n  save();\n  return true;\n}\n";

  expect(spaceSource(before, "read.ts")).toBe(
    "function read() {\n  const first = 1;\n  const second = 2;\n\n  if (first > second) return false;\n\n  save();\n\n  return true;\n}\n",
  );
});

test("attached comments remain attached and trailing comments stay with their statement", () => {
  const before =
    "const first = 1; // first value\n/** Saves the value. */\nfunction save() {\n  return first;\n}\n";

  expect(spaceSource(before, "comments.ts")).toBe(
    "const first = 1; // first value\n\n/** Saves the value. */\nfunction save() {\n  return first;\n}\n",
  );
});

test("TSX text and literal content are unchanged, and applying spacing twice is stable", () => {
  const before =
    'import React from "react";\nconst label = `First\nsecond`;\nexport function View() {\n  const content = "a  b";\n  return <p>{label} and {content}</p>;\n}\n';

  const after = spaceSource(before, "view.tsx");

  const scan = (text: string) => {
    const scanner = ts.createScanner(ts.ScriptTarget.Latest, true, ts.LanguageVariant.JSX, text);
    const tokens = [];

    for (
      let token = scanner.scan();
      token !== ts.SyntaxKind.EndOfFileToken;
      token = scanner.scan()
    ) {
      tokens.push([token, scanner.getTokenText()]);
    }

    return tokens;
  };

  expect(scan(after)).toEqual(scan(before));
  expect(after).toContain("`First\nsecond`");
  expect(after).toContain('"a  b"');
  expect(spaceSource(after, "view.tsx")).toBe(after);
});

test("invalid syntax is rejected instead of being rewritten", () => {
  expect(() => spaceSource("export function {", "broken.ts")).toThrow("invalid syntax");
});
