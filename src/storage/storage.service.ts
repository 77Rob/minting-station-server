import { StorageFile } from "./storage-file";
import { DownloadResponse, Storage } from "@google-cloud/storage";
import { Injectable } from "@nestjs/common";
import StorageConfig from "./storage-config";
import { File } from "web3.storage";
import { IImage } from "src/images/entities/image.entity";

@Injectable()
export class StorageService {
  private storage: Storage;
  private bucket: string;

  constructor() {
    this.storage = new Storage({
      projectId: StorageConfig.projectId,
      credentials: {
        client_email: StorageConfig.client_email,
        private_key: StorageConfig.private_key,
      },
    });
    this.bucket = StorageConfig.mediaBucket;
  }

  async saveJSON(path: string, jsonObject: any) {
    const file = this.storage.bucket(this.bucket).file(path);
    await file.save(JSON.stringify(jsonObject));

    const [signedUrl] = await file.getSignedUrl({
      action: "read",
      expires: "03-09-2491",
    });

    return signedUrl;
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
        const metadataFile = await this.storage
          .bucket(this.bucket)
          .file(path)
          .download();

        const [buffer] = metadataFile;
        const jsonObject = JSON.parse(buffer.toString("utf8"));

        return [imageFile, jsonObject];
      })
    );
  }

  async getFilesWithMetadata(metadataPath: string) {
    const files = await this.storage
      .bucket(this.bucket)
      .getFiles({ prefix: metadataPath });

    return await Promise.all(
      files[0].map(async (file, index) => {
        const fileResponse = await file.download();
        const [buffer] = fileResponse;
        console.log(file.name);
        const fileI = new File([buffer], file.name);

        return fileI;
      })
    );
  }

  async getAllParsedJSONFilesFromPath(path: string) {
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

  async getFileAndMetadata(userId: string, fileName: string): Promise<any> {
    const path = `/${userId}/image/json/${fileName}.json`;
    const file = await this.storage.bucket(this.bucket).file(path).download();

    const [buffer] = file;
    const jsonObject = JSON.parse(buffer.toString("utf8"));

    return jsonObject;
  }

  async saveMedia(
    path: string,
    contentType: string,
    media: Buffer,
    metadata: { [key: string]: string | any }[]
  ) {
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

  async delete(path: string) {
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
