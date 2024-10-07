import path from "path";
import { writeFile } from "fs/promises";

export async function createReactEntry(
  srcPath: string,
  useTailwind: boolean,
  useTypeScript: boolean
) {
  const entryFile = useTypeScript ? "index.tsx" : "index.jsx";
  const entryContent = `
import { createRoot } from 'react-dom/client';
import App from './App';
${useTailwind ? "import './index.css';" : ""}

const container = document.getElementById('react-root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error("React root element not found");
}
`;

  await writeFile(path.join(srcPath, entryFile), entryContent.trim());
}
