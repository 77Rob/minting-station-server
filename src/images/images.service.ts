import { Web3storageService } from "./../web3storage/web3storage.service";
import { Injectable } from "@nestjs/common";
import { StorageService } from "src/storage/storage.service";
import { IImage } from "./entities/image.entity";

type MetadataURI = string;

@Injectable()
export class ImagesService {
  constructor(
    private storageService: StorageService,
    private web3storageService: Web3storageService
  ) {}

  async deleteUserImages(imageNames: string[], userId: string) {
    const pathToJSON = `/${userId}/image/json`;
    const pathToImages = `/${userId}/image/images`;

    await Promise.all(
      imageNames.map(async (name: string) => {
        await this.storageService.delete(`${pathToJSON}/${name}.json`);
      })
    );

    await Promise.all(
      imageNames.map(async (name: string) => {
        await this.storageService.delete(`${pathToImages}/${name}`);
      })
    );
  }
  async deleteUsersAiGeneratedImages(imageNames: string[], userId: string) {
    const path = `/${userId}/ai/json`;

    await Promise.all(
      imageNames.map(async (name) => {
        await this.storageService.delete(`${path}/${name}.json`);
      })
    );
  }

  async uploadImages(files: any, userId: string): Promise<IImage[]> {
    return await Promise.all(
      files.map(async (file) => {
        const signedUrl = await this.storageService.saveMedia(
          `/${userId}/image/images/${file.originalname}`,
          file.encoding,
          file.buffer,
          []
        );

        const imageData: IImage = {
          fileName: file.originalname,
          url: signedUrl,
          name: file.originalname.split(".")[0],
          description: "",
          attributes: [],
        };

        const signedUrlImageData = await this.storageService.saveJSON(
          `/${userId}/image/json/${file.originalname}.json`,
          imageData
        );

        imageData.urlImageData = signedUrlImageData;

        return imageData;
      })
    );
  }

  async generateAndUploadMetadataToIPFS(userId: string): Promise<MetadataURI> {
    const filesAndMetadata = await this.storageService.getAllFilesFromImagePath(
      userId
    );

    const imagesCID = await this.web3storageService.uploadFiles(
      filesAndMetadata.map((file) => {
        return file[0];
      })
    );

    const imagesUrl = this.web3storageService.cidToUrl(imagesCID);
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

      return this.web3storageService.convertObjectToJSONFile(
        `${index}`,
        metadata
      );
    });

    const metadataCid = await this.web3storageService.uploadFiles(
      metadataFiles
    );

    const metadataUrl = this.web3storageService.cidToUrl(metadataCid);
    return metadataUrl;
  }

  async uploadMetadataFilesToIpfsAiGeneratedImages(
    userId: string
  ): Promise<MetadataURI> {
    const path = `/${userId}/ai/json`;
    const metadata = await this.storageService.getAllParsedJSONFilesFromPath(
      path
    );

    const metadataFiles = metadata.map((file, index) => {
      const metadata = {
        image: file.url,
        description: file.description,
        name: file.name,
        attributes: file.attributes.map((attribute) => {
          return {
            trait_type: attribute[0],
            value: attribute[1],
          };
        }),
      };

      return this.web3storageService.convertObjectToJSONFile(
        `${index}`,
        metadata
      );
    });

    const metadataCid = await this.web3storageService.uploadFiles(
      metadataFiles
    );

    const metadataUrl = this.web3storageService.cidToUrl(metadataCid);

    return metadataUrl;
  }
}
