import { mkdirSync, promises as fs } from "fs";
import * as path from "path";
import { installNpmPackages } from "./installNpmPackages";

export async function configureReact(
  useTypeScript: boolean,
  useTailwind: boolean,
  appPath: string
) {
  // Check if the current directory is writable
  try {
    await fs.access(appPath, fs.constants.W_OK);
  } catch (error) {
    console.error("Error: The current directory is not writable.");
    console.error(
      "Please check your permissions or try running with elevated privileges."
    );
    throw error;
  }

  // Initialize npm and install packages
  installNpmPackages(useTypeScript, useTailwind, appPath);

  // Create React entry point
  const srcPath = path.join(appPath, "src");
  mkdirSync(srcPath, { recursive: true });
  const entryFile = useTypeScript ? "index.tsx" : "index.jsx";
  const entryContent = `
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

ReactDOM.render(<h1>Hello, React!</h1>, document.getElementById('root'));
`;

  await fs.writeFile(path.join(srcPath, entryFile), entryContent.trim());
}
