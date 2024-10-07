import { describe, it, expect, vi } from "vitest";
import { configureTailwind } from "../../configurators/tailwind/configureTailwind";
import { createTailwindConfig } from "../../configurators/tailwind/createTailwindConfig";
import { createPostcssConfig } from "../../configurators/tailwind/createPostcssConfig";
import { configureCss } from "../../configurators/tailwind/configureCss";
import { logger } from "../../utils/logger";
import { highlighter } from "../../utils/highlighter";

vi.mock("../../configurators/tailwind/createTailwindConfig");
vi.mock("../../configurators/tailwind/createPostcssConfig");
vi.mock("../../configurators/tailwind/configureCss");
vi.mock("../../utils/logger");
vi.mock("../../utils/highlighter");

describe("configureTailwind", () => {
  const appPath = "some/app/path";

  it("should configure Tailwind successfully with TypeScript", async () => {
    // Arrange
    const useTypescript = true;
    (createTailwindConfig as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      undefined
    );
    (createPostcssConfig as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      undefined
    );
    (configureCss as ReturnType<typeof vi.fn>).mockResolvedValueOnce(undefined);

    // Act
    await configureTailwind(useTypescript, appPath);

    // Assert
    expect(createTailwindConfig).toHaveBeenCalledWith(useTypescript, appPath);
    expect(createPostcssConfig).toHaveBeenCalledWith(appPath);
    expect(configureCss).toHaveBeenCalledWith(appPath);
    expect(logger.success).toHaveBeenCalledWith(
      `✅ ${highlighter.info(
        "Tailwind"
      )} successfully configured with ${highlighter.info("Typescript")}`
    );
  });

  it("should configure Tailwind successfully with JavaScript", async () => {
    // Arrange
    const useTypescript = false;
    (createTailwindConfig as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      undefined
    );
    (createPostcssConfig as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
      undefined
    );
    (configureCss as ReturnType<typeof vi.fn>).mockResolvedValueOnce(undefined);

    // Act
    await configureTailwind(useTypescript, appPath);

    // Assert
    expect(logger.success).toHaveBeenCalledWith(
      `✅ ${highlighter.info(
        "Tailwind"
      )} successfully configured with ${highlighter.info("Javascript")}`
    );
  });

  it("should log an error if configuration fails", async () => {
    // Arrange
    const useTypescript = true;
    const errorMessage = "Failed to configure";
    (createTailwindConfig as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    // Act
    await configureTailwind(useTypescript, appPath);

    // Assert
    expect(logger.error).toHaveBeenCalledWith(
      `Error configuring Tailwind: ${errorMessage}`
    );
  });
});
