import { Web3storageService } from "./../web3storage/web3storage.service";
import { Injectable } from "@nestjs/common";
import { StorageService } from "src/storage/storage.service";

type MetadataURI = string;

@Injectable()
export class ImagesService {
  constructor(
    private storageService: StorageService,
    private web3storageService: Web3storageService
  ) {}

  async deleteImages(imageIds: string[], userId: string) {
    const pathJSON = `/${userId}/image/json`;
    const pathImages = `/${userId}/image/images`;
    await Promise.all(
      imageIds.map(async (id) => {
        await this.storageService.delete(`${pathJSON}/${id}.json`);
      })
    );
    await Promise.all(
      imageIds.map(async (id) => {
        await this.storageService.delete(`${pathImages}/${id}`);
      })
    );
  }

  async generateAndUploadMetadataToIPFS(userId: string): Promise<MetadataURI> {
    const filesAndMetadata = await this.storageService.getAllFilesFromImagePath(
      userId
    );

    const imagesCID = await this.web3storageService.uploadFiles(
      filesAndMetadata.map((file) => {
        console.log(file[0]);
        console.log(file[0].name);
        return file[0];
      })
    );

    const imagesUrl = `https://dweb.link/ipfs/${imagesCID}`;

    const metadataFiles = filesAndMetadata.map((file, index) => {
      const fileData = file[1];
      const metadata = {
        image: `${imagesUrl}/${file[0].name}`,
        description: fileData.description,
        name: fileData.name,
        attributes: fileData.attributes.map((attribute) => {
          return {
            trait_type: attribute[0],
            value: attribute[1],
          };
        }),
      };
      return this.web3storageService.makeFileObject(`${index}`, metadata);
    });

    const metadataCid = await this.web3storageService.uploadFiles(
      metadataFiles
    );
    const metadataUrl = `https://dweb.link/ipfs/${metadataCid}`;

    return metadataUrl;
  }
}
