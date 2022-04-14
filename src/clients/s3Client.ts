import { S3Client } from "@aws-sdk/client-s3";

const DEFAULT_REGION = "ap-northeast-2";

export const s3Client = new S3Client({ region: DEFAULT_REGION });
