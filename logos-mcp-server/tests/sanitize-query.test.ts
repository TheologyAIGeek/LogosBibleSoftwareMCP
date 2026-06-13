import { describe, it, expect } from "vitest";
import { sanitizeSearchQuery } from "../src/services/logos-app.js";

describe("sanitizeSearchQuery", () => {
  it("strips conversational framing verbs", () => {
    expect(sanitizeSearchQuery("what did Thomas Boston say about John 3:16")).toBe(
      "Thomas Boston John 3:16"
    );
  });

  it("treats said/spoke/wrote the same way", () => {
    const expected = "Thomas Boston John 3:16";
    expect(sanitizeSearchQuery("what Thomas Boston said about John 3:16")).toBe(expected);
    expect(sanitizeSearchQuery("what Thomas Boston spoke about John 3:16")).toBe(expected);
    expect(sanitizeSearchQuery("what Thomas Boston wrote about John 3:16")).toBe(expected);
  });

  it("leaves clean topic+author queries untouched", () => {
    expect(sanitizeSearchQuery("justification by faith Calvin")).toBe(
      "justification by faith Calvin"
    );
  });

  it("falls back to original query if everything is stripped", () => {
    expect(sanitizeSearchQuery("what did say about")).toBe("what did say about");
  });

  it("preserves punctuation in references", () => {
    expect(sanitizeSearchQuery("Romans 8:28 Owen")).toBe("Romans 8:28 Owen");
  });
});
