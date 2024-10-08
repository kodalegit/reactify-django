import * as fs from "fs/promises";
import path from "path";

export async function createGitignore(projectPath: string) {
  const gitignoreContent: string = `# Python
    *.pyc
    *.pyo
    *.pyd
    **pycache**/
    *.db
    *.sqlite3
    # Django
    *.log
    local_settings.py
    db.sqlite3
    media/
    staticfiles/
    # React
    node_modules/
    dist/
    *.log
    # Environment variables
    .env
    # IDEs and Editors
    .vscode/
    .idea/
    *.sublime-project
    *.sublime-workspace
    # OS-specific files
    .DS_Store
    Thumbs.db
    # Python virtual environment
    venv/
    .env/
    .venv/
    .virtualenv/
    `;

  await fs.writeFile(path.join(projectPath, ".gitignore"), gitignoreContent);
}
