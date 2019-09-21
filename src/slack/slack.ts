import { IncomingWebhook } from '@slack/webhook'
import { IslackMsg } from './slackModel'
import { config } from '../config/config'
import { isDevEnvironment } from '../utils/utils'

const webhookURL: string = config.get('slack.webhookURL')
const webhook = new IncomingWebhook(webhookURL)

export async function sendToSlack(title: string, imdbID: string, imageURL: string) {
  if (isDevEnvironment(config.get('node.nodeEnv'))) {
    console.log(`Development Environment! Msg to slack surpressed.`)
    return
  }

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
