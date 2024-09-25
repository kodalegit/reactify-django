import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createTemplateTag } from "../../configurators/django/createTemplateTag";
import { mkdirSync, promises as fs } from "fs";
import * as path from "path";

// Mock the fs module
vi.mock("fs", () => ({
  mkdirSync: vi.fn(),
  promises: {
    writeFile: vi.fn(),
  },
}));

// Mock the path module
vi.mock("path", () => ({
  join: vi.fn((...args) => args.join("/")),
  dirname: vi.fn((p) => p.split("/").slice(0, -1).join("/")),
}));

describe("createTemplateTag", () => {
  const mockAppName = "testApp";
  const mockAppPath = "/path/to/testApp";

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    // Mock console.log to avoid cluttering test output
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.log after each test
    vi.restoreAllMocks();
  });

  it("creates template tag and __init__.py files", async () => {
    await createTemplateTag(mockAppName, mockAppPath);

    // Check if mkdirSync was called with the correct arguments
    expect(mkdirSync).toHaveBeenCalledWith("/path/to/testApp/templatetags", {
      recursive: true,
    });

    // Check if writeFile was called twice (for react_root.py and __init__.py)
    expect(fs.writeFile).toHaveBeenCalledTimes(2);

    // Check the content of react_root.ts
    expect(fs.writeFile).toHaveBeenCalledWith(
      "/path/to/testApp/templatetags/react_root.py",
      expect.stringContaining("from django import template")
    );

    // Check the content of __init__.py
    expect(fs.writeFile).toHaveBeenCalledWith(
      "/path/to/testApp/templatetags/__init__.py",
      "# This file makes the templatetags directory a Python package\n"
    );

    // Check if console.log was called with the correct message
    expect(console.log).toHaveBeenCalledWith(
      "Custom template tag and __init__.py file created in testApp/templatetags/"
    );
  });
});
