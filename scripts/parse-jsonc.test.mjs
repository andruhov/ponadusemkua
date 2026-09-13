import assert from "node:assert/strict";
import { test } from "node:test";
import { parseJsonc } from "./parse-jsonc.mjs";

test("keeps // and trailing-looking text inside strings", () => {
  const data = parseJsonc(`{
    "url": "https://example.com/path",
    "note": "wait, } still a string",
    "path": "C://temp",
  }`);
  assert.equal(data.url, "https://example.com/path");
  assert.equal(data.note, "wait, } still a string");
  assert.equal(data.path, "C://temp");
});

test("strips line comments, block comments, and trailing commas", () => {
  const data = parseJsonc(`{
    // heading
    "a": 1,
    /* skip */
    "list": [1, 2, ],
  }`);
  assert.deepEqual(data, { a: 1, list: [1, 2] });
});

test("does not treat escaped quotes as the end of a string", () => {
  const data = parseJsonc(`{ "q": "say \\"hello\\"", }`);
  assert.equal(data.q, 'say "hello"');
});
