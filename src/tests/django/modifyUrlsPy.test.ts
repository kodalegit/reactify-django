import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { existsSync, promises as fs } from "fs";
import path from "path";
import { modifyUrlsPy } from "../../configurators/django/modifyUrlsPy";
vi.mock("fs", () => ({
  existsSync: vi.fn(),
  promises: {
    writeFile: vi.fn(),
  },
}));

vi.mock("path");

describe("modifyUrlsPy", () => {
  const mockAppPath = "/mock/app/path";
  const mockUrlsPath = "/mock/app/path/urls.py";

  beforeEach(() => {
    vi.clearAllMocks();
    (path.join as any).mockReturnValue(mockUrlsPath);
  });

  it("should write the correct initial content to urls.py", async () => {
    const expectedContent = `
from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
]
`;

    await modifyUrlsPy(mockAppPath);

    expect(path.join).toHaveBeenCalledWith(mockAppPath, "urls.py");
    expect(fs.writeFile).toHaveBeenCalledWith(mockUrlsPath, expectedContent);
    expect(fs.writeFile).toHaveBeenCalledTimes(1);
  });

  it("should handle errors appropriately", async () => {
    (fs.writeFile as any).mockRejectedValue(new Error("Write failed"));

    await expect(modifyUrlsPy(mockAppPath)).rejects.toThrow("Write failed");
  });
});
