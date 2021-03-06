import { addImport, RecipeBuilder } from "@blitzjs/installer";
import j from "jscodeshift";
import { Collection } from "jscodeshift/src/Collection";
import { join } from "path";

export function changeEmailFunction(program: Collection<j.Program>) {
  const postmarkIntegrationImport = j.importDeclaration(
    [j.importDefaultSpecifier(j.identifier("postmark"))],
    j.literal("integrations/postmark")
  );

  addImport(program, postmarkIntegrationImport);

  program.find(j.ThrowStatement).forEach((t) => {
    j(t).replaceWith(
      j.expressionStatement(
        j.awaitExpression(
          j.callExpression(
            j.memberExpression(
              j.identifier("postmark"),
              j.identifier("sendMail")
            ),
            [j.identifier("msg")]
          )
        )
      )
    );
  });

  return program;
}

export default RecipeBuilder()
  .setName("Postmark")
  .setDescription(
    "This will install all necessary dependencies and configure postmark for use."
  )
  .setOwner("Tom MacWright <tom@macwright.com>")
  .setRepoLink("https://github.com/placemark/blitz-postmark")
  .addAddDependenciesStep({
    stepId: "addDeps",
    stepName: "npm dependencies",
    explanation: "Install nodemailer and nodemailer-postmark-transport",
    packages: [
      // nodemailer is an indirect dependency of blitz. this doesn't
      // add it to your node_modules, it ensures that it is importable
      // from code
      { name: "nodemailer", version: "6.x" },
      { name: "envsafe", version: "2.x" },
      {
        name: "nodemailer-postmark-transport",
        version: "4.x",
      },
    ],
  })
  .addTransformFilesStep({
    stepId: "importPostmarkInMailer",
    stepName: "Import and use postmark in mailer",
    explanation: "Import postmark integration in mailer, call it.",
    singleFileSearch: "mailers/forgotPasswordMailer.ts",
    transform(program: Collection<j.Program>) {
      return changeEmailFunction(program);
    },
  })
  .addNewFilesStep({
    stepId: "createIntegration",
    stepName: "Add postmark integration",
    explanation: "Adds a postmark integration in the `integrations` directory.",
    targetDirectory: "./integrations",
    templatePath: join(__dirname, "templates", "postmark"),
    templateValues: {},
  })

  .build();
