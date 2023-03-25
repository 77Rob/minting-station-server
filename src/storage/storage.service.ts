import { DownloadResponse, Storage } from "@google-cloud/storage";
import { Injectable } from "@nestjs/common";
import { File } from "web3.storage";
import StorageConfig from "./storage-config";
import { StorageFile } from "./storage-file";

@Injectable()
export class StorageService {
  private storage: Storage;
  private bucket: string;

  constructor() {
    const { projectId, client_email, private_key, mediaBucket } = StorageConfig;

    this.storage = new Storage({
      projectId,
      credentials: {
        client_email,
        private_key,
      },
    });

    this.bucket = mediaBucket;
  }

  async saveJSON(path: string, jsonObject: any): Promise<string> {
    const file = this.storage.bucket(this.bucket).file(path);

    try {
      await file.save(JSON.stringify(jsonObject));
    } catch (error) {
      console.log(`Error saving JSON file: ${error}`);
      throw error;
    }

    const [signedUrl] = await file.getSignedUrl({
      action: "read",
      expires: new Date().getTime() + 7 * 24 * 60 * 60 * 1000, // One week from now
    });

    return signedUrl;
  }

  async saveImage(path: string, imageFile: Blob): Promise<void> {
    await this.storage
      .bucket(this.bucket)
      .file(path)
      .save(imageFile.toString());
  }

  async getJSON(path: string): Promise<any> {
    const metadataFile = await this.storage
      .bucket(this.bucket)
      .file(path)
      .download();

    const [buffer] = metadataFile;
    const jsonObject = JSON.parse(buffer.toString("utf8"));

    return jsonObject;
  }

  async getAllFilesFromImagePath(userId: string): Promise<[File, any][]> {
    const path = `/${userId}/image/images/`;

    const files = await this.storage
      .bucket(this.bucket)
      .getFiles({ prefix: path });

    return await Promise.all(
      files[0].map(async (file, index) => {
        const fileResponse = await file.download();

        const [bufferImage] = fileResponse;
        const imageFile = new File([bufferImage], `${index}.png`);

        const imageFileName = file.name.split("/image/images/")[1];

        const path = `/${userId}/image/json/${imageFileName}.json`;
        const jsonObject = await this.getJSON(path);

        return [imageFile, jsonObject];
      })
    );
  }

  async getAllParsedJSONFilesFromPath(path: string): Promise<any[]> {
    const files = await this.storage
      .bucket(this.bucket)
      .getFiles({ prefix: path });

    return await Promise.all(
      files[0].map(async (file) => {
        const [contents] = await file.download();
        const jsonObject = JSON.parse(contents.toString("utf8"));

        return jsonObject;
      })
    );
  }

  async saveMedia(
    path: string,
    contentType: string,
    media: Buffer,
    metadata: { [key: string]: string | any }[]
  ): Promise<string> {
    const object = metadata.reduce((obj, item) => Object.assign(obj, item), {});
    const file = this.storage.bucket(this.bucket).file(path);
    const stream = file.createWriteStream();
    stream.on("finish", async () => {
      return await file.setMetadata({
        metadata: object,
      });
    });
    stream.end(media);

    const [signedUrl] = await file.getSignedUrl({
      action: "read",
      expires: "03-09-2491",
    });

    return signedUrl;
  }

  async delete(path: string): Promise<void> {
    await this.storage
      .bucket(this.bucket)
      .file(path)
      .delete({ ignoreNotFound: true });
  }

  async get(path: string): Promise<StorageFile> {
    const fileResponse: DownloadResponse = await this.storage
      .bucket(this.bucket)
      .file(path)
      .download();
    const [buffer] = fileResponse;
    const storageFile = new StorageFile();
    storageFile.buffer = buffer;
    storageFile.metadata = new Map<string, string>();
    return storageFile;
  }
}
