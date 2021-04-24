import { envsafe, str } from "envsafe";
import nodemailer from "nodemailer";
import postmarkTransport from "nodemailer-postmark-transport";

const { NODE_ENV } = process.env;

const { POSTMARK_SERVER_API_TOKEN } = envsafe({
  POSTMARK_SERVER_API_TOKEN: str({ devDefault: "" }),
});

const transport = nodemailer.createTransport(
  NODE_ENV === "production"
    ? postmarkTransport({
        auth: {
          apiKey: POSTMARK_SERVER_API_TOKEN,
        },
      })
    : {
        streamTransport: true,
      }
);

export default transport;
