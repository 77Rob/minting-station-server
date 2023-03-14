import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UploadedFiles,
  UseInterceptors,
  Headers,
  Header,
} from "@nestjs/common";
import { ImagesService } from "./images.service";
import { UpdateImageDto } from "./dto/update-image.dto";
import { StorageService } from "src/storage/storage.service";
import { FilesInterceptor } from "@nestjs/platform-express";
import { IImage, Image } from "./entities/image.entity";
import { Web3storageService } from "src/web3storage/web3storage.service";

type ImagesType = {
  [key: string]: IImage[];
};

@Controller("images")
export class ImagesController {
  images: ImagesType = {};
  constructor(
    private readonly imagesService: ImagesService,
    private readonly web3storageService: Web3storageService,
    private storageService: StorageService
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor("file"))
  async create(@UploadedFiles() files, @Headers() headers) {
    const userId = headers.userid;
    if (!this.images[userId]) {
      this.images[userId] = [];
    }

    const newImagesData = await Promise.all(
      files.map(async (file) => {
        const signedUrl = await this.storageService.saveMedia(
          `/${userId}/image/images/${file.originalname}`,
          file.mimetype,
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

        this.images[userId].push(imageData);
        return imageData;
      })
    );

    return JSON.stringify(newImagesData);
  }

  @Get()
  async findAllUserMetadata(@Headers("userId") userId: any) {
    const path = `/${userId}/image/json`;

    return await this.storageService.getAllParsedJSONFilesFromPath(path);
  }

  @Post("delete")
  async delete(@Body() body) {
    const { fileNames } = body.params;
    const { userId } = body.headers;
    await this.imagesService.deleteImages(fileNames, userId);
  }

  @Post("update")
  async update(@Body() body) {
    const { imageData } = body.params;
    const { userId } = body.headers;
    const path = `/${userId}/image/json`;
    await this.storageService.saveJSON(
      `${path}/${imageData.fileName}.json`,
      imageData
    );
  }

  @Get("metadataURI")
  async generateMetadataURI(@Headers("userId") userId: any) {
    const cid = await this.imagesService.generateAndUploadMetadataToIPFS(
      userId
    );
    return cid;
  }
}
