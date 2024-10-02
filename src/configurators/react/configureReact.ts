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
  await installNpmPackages(useTypeScript, useTailwind, appPath);

  // Create React entry point
  const srcPath = path.join(appPath, "src");
  mkdirSync(srcPath, { recursive: true });
  const entryFile = useTypeScript ? "index.tsx" : "index.jsx";
  const entryContent = `
import { createRoot } from 'react-dom/client';
import App from './App';
${useTailwind ? "import './index.css'" : ""};

const container = document.getElementById('react-root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error("React root element not found");
}
`;

  await fs.writeFile(path.join(srcPath, entryFile), entryContent.trim());

  const appFile = useTypeScript ? "App.tsx" : "App.jsx";
  const appContent = `
const App = () => {
return (
  <div>
    <h1>Hello World</h1>
  </div>
);
};

export default App;
`;

  await fs.writeFile(path.join(srcPath, appFile), appContent.trim());
}
