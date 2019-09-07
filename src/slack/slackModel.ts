export interface IslackMsg {
  attachments: IslackMsgAttachment[]
}

interface IslackMsgAttachment {
  fallback: string
  pretext: string
  image_url: string
  title: string
  title_link: string
}

// export const slackMsg = {
//   attachments: [
//     {
//       fallback: "watch this: ",
//       pretext: "Watch this:",
//       title: "Star Wars",
//       title_link: "https://www.imdb.com/title/tt2527336",
//       image_url: "http://i.imgur.com/OJkaVOI.jpg?1"
//     }
//   ]
// };
