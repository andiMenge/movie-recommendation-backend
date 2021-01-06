import { config } from '../config/config'
import * as Minio from 'minio'
import fs from 'fs'
import policy from './bucketPolicy.json'

const S3_BUCKET_NAME = 'movie-fav-thumbnails'
export const S3_BASE_URL = `https://data.andimenge.de/${S3_BUCKET_NAME}/`

const minioClient = new Minio.Client({
  endPoint: 'data.andimenge.de',
  port: 443,
  useSSL: true,
  accessKey: config.get('s3.accessKey'),
  secretKey: config.get('s3.secretKey'),
})

export async function s3Init() {
  if ((await minioClient.bucketExists(S3_BUCKET_NAME)) === false) {
    await minioClient.makeBucket(S3_BUCKET_NAME, 'threethink')
    console.log(`S3 Bucket does not exist. Creating bucket ${S3_BUCKET_NAME}`)
  }
  console.log(`S3 Bucket ${S3_BUCKET_NAME} exists, skipping creation`)
  console.log('Setting bucket policy ...')
  setBucketPolicy(S3_BUCKET_NAME, policy)
}

export async function uploadToS3(tmpFilePath: string | Buffer, filename: string) {
  try {
    const fileStream = fs.createReadStream(tmpFilePath)
    await minioClient.putObject(S3_BUCKET_NAME, filename, fileStream)
    fs.unlinkSync(tmpFilePath)
  } catch (error) {
    console.error(error)
    throw error
  }
}

async function setBucketPolicy(bucketName: string, policy: any) {
  try {
    await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy))
  } catch (error) {
    console.error(error)
    throw error
  }
}
