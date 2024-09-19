import * as fs from "fs";

export async function createGitignore() {
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

  fs.writeFileSync(".gitignore", gitignoreContent);
}
