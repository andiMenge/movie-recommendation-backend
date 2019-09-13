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
