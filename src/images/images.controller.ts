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
} from "@nestjs/common";
import { ImagesService } from "./images.service";
import { UpdateImageDto } from "./dto/update-image.dto";
import { StorageService } from "src/storage/storage.service";
import { FilesInterceptor } from "@nestjs/platform-express";

@Controller("images")
export class ImagesController {
  images = {};
  constructor(
    private readonly imagesService: ImagesService,
    private storageService: StorageService
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor("file"))
  async create(@UploadedFiles() files, @Headers() headers) {
    const userId = headers.userid;
    if (!this.images[userId]) {
      this.images[userId] = [];
    }
    console.time("Function #1");

    const newImagesData = await Promise.all(
      files.map(async (file) => {
        const signedUrl = await this.storageService.saveMedia(
          `/${userId}/image/images/${file.originalname}`,
          file.mimetype,
          file.buffer,
          []
        );
        const imageData = {
          userId: userId,
          fileName: file.originalname,
          url: signedUrl,
          name: file.originalname.split(".")[0],
          attributes: [],
        };

        const signedUrlImageData = await this.storageService.saveJSON(
          `/${userId}/image/json/${file.originalname}.json`,
          imageData
        );

        this.images[userId].push(signedUrlImageData);
        return imageData;
      })
    );
    console.timeEnd("Function #1");

    return JSON.stringify(newImagesData);
  }

  @Get(":userId")
  async findAllUserMetadata(@Param("userId") userId: string) {
    const path = `/${userId}/image/json`;

    return await this.storageService.getAllFilesFromPath(path);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateImageDto: UpdateImageDto) {
    return this.imagesService.update(+id, updateImageDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.imagesService.remove(+id);
  }
}
