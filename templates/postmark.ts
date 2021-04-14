import nodemailer from "nodemailer";
import postmarkTransport from "nodemailer-postmark-transport";

const { NODE_ENV, POSTMARK_SERVER_API_TOKEN } = process.env;

if (NODE_ENV === "production" && !POSTMARK_SERVER_API_TOKEN) {
  throw new Error("Environment variable POSTMARK_SERVER_API_TOKEN missing");
}

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
