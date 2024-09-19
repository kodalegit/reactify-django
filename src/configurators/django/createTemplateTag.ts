import { mkdirSync, promises as fs } from "fs";
import * as path from "path";

export async function createTemplateTag(appName: string) {
  const tagCode = `
import { template } from 'django';
import { static as djangoStatic } from 'django.templatetags.static';

const register = template.Library();

@register.simple_tag
function reactRoot(): string {
    // Create the URL for the React bundled script using Django's static tag
    const scriptUrl = djangoStatic(\`${appName}/js/bundle.js\`);
    return \`
<div id="root"></div>
<script src="\${scriptUrl}"></script>
\`;
}
`;

  const tagPath = path.join(appName, "templatetags", "react_root.ts");
  mkdirSync(path.dirname(tagPath), { recursive: true });
  await fs.writeFile(tagPath, tagCode);

  const initPath = path.join(appName, "templatetags", "__init__.py");
  fs.writeFile(
    initPath,
    "# This file makes the templatetags directory a Python package\n"
  );

  console.log(
    `Custom template tag and __init__.py file created in ${appName}/templatetags/`
  );
}
