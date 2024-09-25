import { mkdirSync, promises as fs } from "fs";
import * as path from "path";

export async function createTemplateTag(appName: string, appPath: string) {
  const tagCode = `
from django import template
from django.templatetags.static import static

register = template.Library()

@register.simple_tag
def react_root():
    # Create the URL for the React bundled script using Django's static tag
    script_url = static('${appName}/js/bundle.js')
    return f'''
<div id="root"></div>
<script src="{{{{ script_url }}}}"></script>
'''
`;

  const tagPath = path.join(appPath, "templatetags", "react_root.py");
  mkdirSync(path.dirname(tagPath), { recursive: true });
  await fs.writeFile(tagPath, tagCode);

  const initPath = path.join(appPath, "templatetags", "__init__.py");
  await fs.writeFile(
    initPath,
    "# This file makes the templatetags directory a Python package\n"
  );

  console.log(
    `Custom template tag and __init__.py file created in ${appName}/templatetags/`
  );
}
