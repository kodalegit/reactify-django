import { describe, it, expect, vi } from "vitest";
import * as fs from "fs/promises";
import path from "path";
import { createGitignore } from "../../configurators/django/createGitignore";

vi.mock("fs/promises");

describe("createGitignore", () => {
  it("should create a .gitignore file with the correct content", async () => {
    const projectPath = "/mock/project/path";
    const gitignorePath = path.join(projectPath, ".gitignore");

    (fs.writeFile as any).mockResolvedValue(undefined);

    await createGitignore(projectPath);

    const expectedContent = `# Python
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

    expect(fs.writeFile).toHaveBeenCalledWith(gitignorePath, expectedContent);
  });
});
