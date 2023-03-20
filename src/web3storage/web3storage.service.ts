import { Injectable } from "@nestjs/common";
import { File, Web3Storage, Blob } from "web3.storage";
import { Web3StorageConfig } from "./web3storage-config";
import { getFilesFromPath } from "web3.storage";

@Injectable()
export class Web3storageService {
  private storage: Web3Storage;
  private ipfsResolver: string;

  constructor() {
    this.storage = new Web3Storage({ token: Web3StorageConfig.api_key });
    this.ipfsResolver = Web3StorageConfig.ipfsResolver;
  }

  convertObjectToJSONFile(fileName: string, object: any): File {
    const blob = new Blob([JSON.stringify(object)], {
      type: "application/json",
    });

    return new File([blob], fileName);
  }

  async uploadJSONFile(fileName: string, object: any): Promise<string> {
    const file = this.convertObjectToJSONFile(fileName, object);
    const cid = await this.storage.put([file]);
    return cid;
  }

  cidToUrl(cid: string): string {
    return `${this.ipfsResolver}${cid}`;
  }

  async getFiles(path: string): Promise<any[]> {
    const files = await getFilesFromPath(path);
    console.log(`read ${files.length} file(s) from ${path}`);
    return files;
  }

  async uploadFiles(
    files: File[],
    wrapWithDirectory: boolean = true
  ): Promise<string> {
    const cid = await this.storage.put(files, {
      wrapWithDirectory,
    });

    return cid;
  }
}
