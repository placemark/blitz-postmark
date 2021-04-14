import * as Fs from "fs";
import * as Path from "path";
import j from "jscodeshift";
import { customTsParser } from "@blitzjs/installer";
import { changeEmailFunction } from "../";

const input = Fs.readFileSync(
  Path.join(__dirname, "../fixtures/forgotPasswordMailer.ts"),
  "utf8"
);

it("transform", () => {
  const output = changeEmailFunction(
    j(input, {
      parser: customTsParser,
    })
  ).toSource();
  expect(output).toMatchSnapshot();
});
