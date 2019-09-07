import { IncomingWebhook } from "@slack/webhook";

const webhookURL = process.env.SLACK_WEBHOOK_URL;
const webhook = new IncomingWebhook(webhookURL);

export async function sendToSlack(msg: object) {
  try {
    await webhook.send(msg);
  } catch (error) {
    console.error(error.message);
    throw new Error("Could not send slack message");
  }
}
