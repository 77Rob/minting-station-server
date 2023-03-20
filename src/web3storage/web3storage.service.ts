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

  makeFileObject(fileName, object) {
    // You can create File objects from a Blob of binary data
    // see: https://developer.mozilla.org/en-US/docs/Web/API/Blob

    const blob = new Blob([JSON.stringify(object)], {
      type: "application/json",
    });

    console.log(blob);
    return new File([blob], fileName);
  }

  async uploadJSONFile(fileName, object) {
    const file = this.makeFileObject(fileName, object);
    const cid = await this.storage.put([file]);
    return cid;
  }

  cidToUrl(cid) {
    return `${this.ipfsResolver}${cid}`;
  }

  async getFiles(path) {
    const files = await getFilesFromPath(path);
    console.log(`read ${files.length} file(s) from ${path}`);
    return files;
  }

  async uploadFiles(files, wrapWithDirectory = true) {
    console.log("Uploading files");
    console.log(files);
    const cid = await this.storage.put(files, {
      wrapWithDirectory,
    });

    return cid;
  }
}
