import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createAppComponent } from "../../configurators/react/createAppComponent";
import path from "path";
import { writeFile } from "fs/promises";
import { promises as fs } from "fs";

// Mock fs/promises
vi.mock("fs/promises", () => ({
  writeFile: vi.fn(),
}));

describe("createAppComponent", () => {
  const mockSrcPath = "/mock/src";

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Reset all mocks after each test
    vi.resetAllMocks();
  });

  it("should create App.tsx when TypeScript is enabled", async () => {
    // Arrange
    const useTypeScript = true;
    const expectedPath = path.join(mockSrcPath, "App.tsx");
    const expectedContent = `
const App = () => {
return (
  <div>
    <h1>Hello World!</h1>
    <div>Here's your React App component.</div>
  </div>
);
};

export default App;
`.trim();

    // Act
    await createAppComponent(mockSrcPath, useTypeScript);

    // Assert
    expect(writeFile).toHaveBeenCalledTimes(1);
    expect(writeFile).toHaveBeenCalledWith(expectedPath, expectedContent);
  });

  it("should create App.jsx when TypeScript is disabled", async () => {
    // Arrange
    const useTypeScript = false;
    const expectedPath = path.join(mockSrcPath, "App.jsx");
    const expectedContent = `
const App = () => {
return (
  <div>
    <h1>Hello World!</h1>
    <div>Here's your React App component.</div>
  </div>
);
};

export default App;
`.trim();

    // Act
    await createAppComponent(mockSrcPath, useTypeScript);

    // Assert
    expect(writeFile).toHaveBeenCalledTimes(1);
    expect(writeFile).toHaveBeenCalledWith(expectedPath, expectedContent);
  });
});
