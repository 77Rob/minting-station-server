import { Body, Controller, Get, Headers, Post, Req } from "@nestjs/common";
import { AiService } from "src/ai/ai.service";
import { StorageService } from "src/storage/storage.service";
import { Web3storageService } from "src/web3storage/web3storage.service";
import { IImage } from "./entities/image.entity";
import { ImagesService } from "./images.service";

type ImagesType = {
  [key: string]: IImage[];
};

@Controller("images")
export class ImagesController {
  constructor(
    private readonly imagesService: ImagesService,
    private readonly web3storageService: Web3storageService,
    private storageService: StorageService,
    private aiService: AiService
  ) {}

  @Post()
  async upload(@Headers() headers, @Req() req) {
    const userId = headers.userid;
    const files = req.files;

    const uploadedImageData = await this.imagesService.uploadImages(
      files,
      userId
    );

    return JSON.stringify(uploadedImageData);
  }

  @Post("generateai")
  async getAi(@Body() body) {
    const { prompt } = body.params;
    const { userId } = body.headers;

    const image = await this.aiService.generate(prompt);
    if (image == undefined) {
      return {
        type: "error",
        message: "Api limit reached. Please try again later.",
      };
    }

    const ipfsCID = await this.web3storageService.uploadFiles([image], false);
    const ipfsURL = this.web3storageService.cidToUrl(ipfsCID);
    const imagedata: IImage = {
      name: prompt,
      description: prompt,
      url: ipfsURL,
      attributes: [],
      fileName: `${prompt}.json`,
    };

    const signedUrl = await this.storageService.saveJSON(
      `/${userId}/ai/json/${prompt}.json`,
      imagedata
    );

    return imagedata;
  }

  @Get()
  async getUserImageData(@Headers("userId") userId: any): Promise<IImage[]> {
    const path = `/${userId}/image/json`;

    return await this.storageService.getAllParsedJSONFilesFromPath(path);
  }

  @Get("ai")
  async getUserAiGeneratedImageData(
    @Headers("userId") userId: any
  ): Promise<IImage[]> {
    const path = `/${userId}/ai/json`;

    return await this.storageService.getAllParsedJSONFilesFromPath(path);
  }

  @Post("delete")
  async deleteUserImages(@Body() body): Promise<void> {
    const { fileNames } = body.params;
    const { userId } = body.headers;

    await this.imagesService.deleteUserImages(fileNames, userId);
  }

  @Post("update")
  async updateImageData(@Body() body): Promise<void> {
    const { imageData } = body.params;
    const { userId } = body.headers;

    const path = `/${userId}/image/json`;

    await this.storageService.saveJSON(
      `${path}/${imageData.fileName}.json`,
      imageData
    );
  }

  @Post("ai/update")
  async updateAiGeneratedImageData(@Body() body): Promise<void> {
    const { imageData } = body.params;
    const { userId } = body.headers;

    const path = `/${userId}/ai/json`;

    await this.storageService.saveJSON(
      `${path}/${imageData.fileName}.json`,
      imageData
    );
  }

  @Get("metadataURI")
  async generateMetadataURI(@Headers("userId") userId: any): Promise<string> {
    const metadataUri =
      await this.imagesService.generateAndUploadMetadataToIPFS(userId);
    return metadataUri;
  }

  @Get("ai/metadataURI")
  async generateMetadataURIAi(@Headers("userId") userId: any): Promise<string> {
    const metadataUri =
      await this.imagesService.uploadMetadataFilesToIpfsAiGeneratedImages(
        userId
      );
    return metadataUri;
  }
}
