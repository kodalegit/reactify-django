import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createReactEntry } from "../../configurators/react/createReactEntry";
import path from "path";
import { writeFile } from "fs/promises";

// Mock fs/promises
vi.mock("fs/promises", () => ({
  writeFile: vi.fn(),
}));

describe("createReactEntry", () => {
  const mockSrcPath = "/mock/src";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should create index.tsx with Tailwind when TypeScript and Tailwind are enabled", async () => {
    // Arrange
    const useTailwind = true;
    const useTypeScript = true;
    const expectedPath = path.join(mockSrcPath, "index.tsx");
    const expectedContent = `
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const container = document.getElementById('react-root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error("React root element not found");
}`.trim();

    // Act
    await createReactEntry(mockSrcPath, useTailwind, useTypeScript);

    // Assert
    expect(writeFile).toHaveBeenCalledTimes(1);
    expect(writeFile).toHaveBeenCalledWith(expectedPath, expectedContent);
  });

  it("should create index.tsx without Tailwind when only TypeScript is enabled", async () => {
    // Arrange
    const useTailwind = false;
    const useTypeScript = true;
    const expectedPath = path.join(mockSrcPath, "index.tsx");
    const expectedContent = `
import { createRoot } from 'react-dom/client';
import App from './App';


const container = document.getElementById('react-root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error("React root element not found");
}`.trim();

    // Act
    await createReactEntry(mockSrcPath, useTailwind, useTypeScript);

    // Assert
    expect(writeFile).toHaveBeenCalledTimes(1);
    expect(writeFile).toHaveBeenCalledWith(expectedPath, expectedContent);
  });

  it("should create index.jsx with Tailwind when only Tailwind is enabled", async () => {
    // Arrange
    const useTailwind = true;
    const useTypeScript = false;
    const expectedPath = path.join(mockSrcPath, "index.jsx");
    const expectedContent = `
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const container = document.getElementById('react-root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error("React root element not found");
}`.trim();

    // Act
    await createReactEntry(mockSrcPath, useTailwind, useTypeScript);

    // Assert
    expect(writeFile).toHaveBeenCalledTimes(1);
    expect(writeFile).toHaveBeenCalledWith(expectedPath, expectedContent);
  });

  it("should create index.jsx without Tailwind when both features are disabled", async () => {
    // Arrange
    const useTailwind = false;
    const useTypeScript = false;
    const expectedPath = path.join(mockSrcPath, "index.jsx");
    const expectedContent = `
import { createRoot } from 'react-dom/client';
import App from './App';


const container = document.getElementById('react-root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error("React root element not found");
}`.trim();

    // Act
    await createReactEntry(mockSrcPath, useTailwind, useTypeScript);

    // Assert
    expect(writeFile).toHaveBeenCalledTimes(1);
    expect(writeFile).toHaveBeenCalledWith(expectedPath, expectedContent);
  });
});
