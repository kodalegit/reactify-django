import { mkdirSync, promises as fs } from "fs";
import * as path from "path";
import { installNpmPackages } from "./installNpmPackages";

interface ConfigureReactOptions {
  appName: string;
  useTypeScript: boolean;
  useTailwind: boolean;
}

export function configureReact({
  appName,
  useTypeScript,
  useTailwind,
}: ConfigureReactOptions): void {
  // Navigate to app directory
  process.chdir(appName);

  // Initialize npm and install packages
  installNpmPackages(useTypeScript, useTailwind);

  // Create React entry point
  mkdirSync("src", { recursive: true });
  const entryFile = useTypeScript ? "index.tsx" : "index.jsx";
  const entryContent = `
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

ReactDOM.render(<h1>Hello, React!</h1>, document.getElementById('root'));
`;

  fs.writeFile(path.join("src", entryFile), entryContent.trim());
}
