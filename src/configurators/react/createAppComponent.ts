import path from "path";
import { writeFile } from "fs/promises";

export async function createAppComponent(
  srcPath: string,
  useTypeScript: boolean
) {
  const appFile = useTypeScript ? "App.tsx" : "App.jsx";
  const appContent = `
const App = () => {
return (
  <div>
    <h1>Hello World!</h1>
    <div>Here's your React App component.</div>
  </div>
);
};

export default App;
`;

  await writeFile(path.join(srcPath, appFile), appContent.trim());
}
