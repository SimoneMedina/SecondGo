import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { randomUUID } from 'crypto';
import { extname } from 'path';

export interface UploadedStorageFile {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly client: Client;
  private readonly bucket: string;
  private readonly publicUrl: string;

  constructor(private readonly config: ConfigService) {
    const endpoint = this.config.get<string>('MINIO_ENDPOINT') || 'localhost';
    const port = Number(this.config.get<string>('MINIO_PORT') || 29100);
    const useSSL = this.config.get<string>('MINIO_USE_SSL') === 'true';

    this.bucket = this.config.get<string>('MINIO_BUCKET') || 'secondgo-fotos';
    this.publicUrl =
      this.config.get<string>('MINIO_PUBLIC_URL') ||
      `http://${endpoint}:${port}`;
    this.client = new Client({
      endPoint: endpoint,
      port,
      useSSL,
      accessKey: this.config.get<string>('MINIO_ACCESS_KEY') || 'minioadmin',
      secretKey:
        this.config.get<string>('MINIO_SECRET_KEY') || 'minioadminpassword',
    });
  }

  async onModuleInit() {
    const exists = await this.client.bucketExists(this.bucket);
    if (!exists) {
      await this.client.makeBucket(this.bucket);
    }

    await this.client.setBucketPolicy(
      this.bucket,
      JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${this.bucket}/*`],
          },
        ],
      }),
    );
  }

  async uploadFile(
    file: UploadedStorageFile,
    folder = 'uploads',
  ): Promise<string> {
    const extension =
      extname(file.originalname) || this.getExtension(file.mimetype);
    const objectName = `${folder}/${randomUUID()}${extension}`;

    await this.client.putObject(
      this.bucket,
      objectName,
      file.buffer,
      file.size,
      { 'Content-Type': file.mimetype },
    );

    return `${this.publicUrl}/${this.bucket}/${objectName}`;
  }

  private getExtension(mimetype: string): string {
    const extension = mimetype.split('/')[1];
    return extension ? `.${extension}` : '';
  }
}
