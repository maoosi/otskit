// typedoc-plugin-otskit
// @ts-check

import { ReflectionKind } from "typedoc";
import { MarkdownPageEvent } from "typedoc-plugin-markdown";

function cleanup(signatureOrReflection) {
  if ("parameters" in signatureOrReflection) {
    signatureOrReflection.parameters = [];
  }
  if ("type" in signatureOrReflection) {
    signatureOrReflection.type = undefined;
  }
  if ("typeParameters" in signatureOrReflection) {
    signatureOrReflection.typeParameters = [];
  }
  if ("comment" in signatureOrReflection && signatureOrReflection.comment) {
    signatureOrReflection.comment.blockTags =
      signatureOrReflection.comment.blockTags.filter(
        (tag) => tag.tag === "@example" || tag.tag === "@remarks"
      );
  }
}

/**
 * @param {import('typedoc').Application} app
 */
export function load(app) {
  app.converter.on("resolveEnd", (context) => {
    const project = context.project;

    for (const reflection of project.getReflectionsByKind(ReflectionKind.All)) {
      if ("signatures" in reflection && Array.isArray(reflection.signatures)) {
        for (const signature of reflection.signatures) {
          cleanup(signature);
        }
      }
    }
  });

  app.renderer.on(MarkdownPageEvent.END, (page) => {
    if (typeof page.contents === "string") {
      page.contents = page.contents
        // Remove the quoted signature line
        .replace(/^\n*>+\s+\*\*.+?\*\*.*\n*/gm, "\n");
    }
  });
}
