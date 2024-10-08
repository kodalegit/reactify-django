import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { modifyRootUrlsPy } from "../../configurators/django/modifyRootUrlsPy";
import { promises as fs } from "fs";
import { existsSync } from "fs";

vi.mock("fs", () => ({
  promises: {
    readFile: vi.fn(),
    writeFile: vi.fn(),
  },
  existsSync: vi.fn(),
}));

vi.mock("path", () => ({
  join: (...args: string[]) => args.join("/"),
}));

describe("modifyRootUrlsPy", () => {
  const mockProjectPath = "/fake/path";
  const mockProjectName = "myproject";
  const mockAppName = "myapp";
  const mockFilePath = `${mockProjectPath}/${mockProjectName}/urls.py`;

  beforeEach(() => {
    vi.clearAllMocks();
    console.error = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should handle non-existent urls.py file", async () => {
    vi.mocked(existsSync).mockReturnValue(false);

    await expect(
      modifyRootUrlsPy(mockProjectPath, mockProjectName, mockAppName)
    ).rejects.toThrow(
      "Root urls.py file not found! Modify the urls.py manually to include installed app."
    );
  });

  it("should create proper urls.py content with no docstring", async () => {
    const originalContent = `from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
]`;

    const expectedContent = `from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("", include("myapp.urls")),
    path('admin/', admin.site.urls),
]
`;

    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(fs.readFile).mockResolvedValueOnce(originalContent);
    vi.mocked(fs.writeFile).mockResolvedValueOnce(undefined);

    await modifyRootUrlsPy(mockProjectPath, mockProjectName, mockAppName);

    expect(fs.writeFile).toHaveBeenCalledWith(mockFilePath, expectedContent);
  });

  it("should preserve existing docstring when modifying urls.py", async () => {
    const originalContent = `"""
This is a test docstring.
More information here.
"""
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
]`;

    const expectedContent = `"""
This is a test docstring.
More information here.
"""
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("", include("myapp.urls")),
    path('admin/', admin.site.urls),
]
`;

    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(fs.readFile).mockResolvedValueOnce(originalContent);
    vi.mocked(fs.writeFile).mockResolvedValueOnce(undefined);

    await modifyRootUrlsPy(mockProjectPath, mockProjectName, mockAppName);

    expect(fs.writeFile).toHaveBeenCalledWith(mockFilePath, expectedContent);
  });
});
