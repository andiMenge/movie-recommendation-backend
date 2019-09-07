import { IncomingWebhook } from '@slack/webhook'
import { IslackMsg } from './slackModel'

const webhookURL = process.env.SLACK_WEBHOOK_URL
const webhook = new IncomingWebhook(webhookURL)

export async function sendToSlack(title: string, imdbID: string, imageURL: string) {
  const msg: IslackMsg = {
    attachments: [
      {
        fallback: `watch ${title}`,
        pretext: 'Watch this:',
        image_url: imageURL,
        title: title,
        title_link: `https://www.imdb.com/title/${imdbID}`,
      },
    ],
  }

  try {
    await webhook.send(msg)
  } catch (error) {
    console.error(error.message)
    throw new Error('Could not send slack message')
  }
}
