import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

interface S3Config {
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  region: string;
}

class S3Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(config: S3Config) {
    this.s3Client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
    this.bucketName = config.bucketName;
  }

  async uploadImage(imageBlob: Blob, fileName: string): Promise<string> {
    try {
      console.log(`Uploading image: ${fileName} to S3 bucket: ${this.bucketName}`);
      
      // Convert blob to array buffer
      const arrayBuffer = await imageBlob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: `vendor-images/${fileName}`,
        Body: uint8Array,
        ContentType: imageBlob.type || 'image/jpeg',
        ACL: 'public-read',
        CacheControl: 'max-age=31536000', // Cache for 1 year
      });

      await this.s3Client.send(command);
      
      // Return the public URL
      const s3Url = `https://${this.bucketName}.s3.${this.s3Client.config.region}.amazonaws.com/vendor-images/${fileName}`;
      console.log(`Successfully uploaded image to: ${s3Url}`);
      return s3Url;
    } catch (error) {
      console.error('Error uploading to S3:', error);
      throw error;
    }
  }

  static isConfigured(): boolean {
    const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
    const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
    const bucketName = import.meta.env.VITE_AWS_BUCKET_NAME;
    const region = import.meta.env.VITE_AWS_REGION;

    return !!(accessKeyId && secretAccessKey && bucketName && region);
  }

  static createInstance(): S3Service | null {
    if (!this.isConfigured()) {
      return null;
    }

    const config: S3Config = {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID!,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY!,
      bucketName: import.meta.env.VITE_AWS_BUCKET_NAME!,
      region: import.meta.env.VITE_AWS_REGION!,
    };

    return new S3Service(config);
  }
}

export default S3Service;