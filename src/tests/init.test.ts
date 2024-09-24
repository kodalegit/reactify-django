import { describe, it, vi, expect } from "vitest";
import { init } from "../commands/init";
import prompts from "prompts";
import { configureDjango } from "../configurators/django/configureDjango";
import { configureReact } from "../configurators/react/configureReact";
import { configureBundling } from "../configurators/bundling/configureBundling";
import { configureTypescript } from "../configurators/typescript/configureTypescript";
import { configureTailwind } from "../configurators/tailwind/configureTailwind";
import { configureEslint } from "../configurators/eslint/configureEslint";

vi.mock("prompts");
vi.mock("../configurators/django/configureDjango");
vi.mock("../configurators/react/configureReact");
vi.mock("../configurators/bundling/configureBundling");
vi.mock("../configurators/typescript/configureTypescript");
vi.mock("../configurators/tailwind/configureTailwind");
vi.mock("../configurators/eslint/configureEslint");

describe("init command", () => {
  it("should configure Django and React based on user input", async () => {
    // Mock responses from prompts
    (prompts as any).mockResolvedValueOnce({
      projectName: "testProject",
      appName: "testApp",
      useTypescript: true,
      useTailwind: true,
    });

    // Simulate the command-line arguments, including --cwd
    const mockArgv = ["node", "cli.js", "--cwd", "/mock/path"];

    // Use .parseAsync() to simulate running the command
    await init.parseAsync(mockArgv);

    // Assert configuration functions were called with expected arguments
    expect(configureDjango).toHaveBeenCalledWith(
      "testProject",
      "testApp",
      "/mock/path"
    );
    expect(configureReact).toHaveBeenCalledWith(
      true,
      true,
      "/mock/path/testProject/testApp"
    );
    expect(configureEslint).toHaveBeenCalledWith(
      true,
      "/mock/path/testProject/testApp"
    );
    expect(configureBundling).toHaveBeenCalledWith(
      "testApp",
      true,
      "/mock/path/testProject/testApp"
    );
    expect(configureTypescript).toHaveBeenCalledWith(
      "/mock/path/testProject/testApp"
    );
    expect(configureTailwind).toHaveBeenCalledWith(
      true,
      "/mock/path/testProject/testApp"
    );
  });
});
