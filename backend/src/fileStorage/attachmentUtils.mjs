import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import {
  getSignedUrl,
} from "@aws-sdk/s3-request-presigner";



const createPresignedUrlWithClient = ({ region, bucket, key }) => {
  const client = new S3Client({ region });
  const command = new PutObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(client, command, { expiresIn: 3600 });
};

// Function to save an image to S3 and return a presigned URL
export async function filePreSignedUrl(fileName,context) {

  const BUCKET_NAME = process.env.BUCKET
  const REGION = "us-east-1"
  const params = {
    region: REGION,
    bucket: BUCKET_NAME,
    key: fileName
  };

  try {

    context.logger.info('create Presigneurl:');
    const presignedUrl = await createPresignedUrlWithClient(params)
    context.logger.info('Presigneurl:', presignedUrl);

    return presignedUrl;
  } catch (error) {
    context.logger.error('Error getting presigneurl:', error);
    throw error;
  }
}
