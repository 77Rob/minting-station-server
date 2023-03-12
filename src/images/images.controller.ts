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
    console.log(headers, userId);
    console.time("Function #1");

    if (!this.images[userId]) {
      this.images[userId] = [];
    }
    const newImagesMetadata = [];
    for (const file of files) {
      const signedUrl = await this.storageService.saveMedia(
        `/${userId}/images/${file.originalname}`,
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
      console.log(imageData);
      newImagesMetadata.push(imageData);
      const signedUrlImageData = await this.storageService.saveJSON(
        `/${userId}/images/${file.originalname}.json`,
        imageData
      );

      this.images[userId].push(signedUrlImageData);
    }

    console.log(newImagesMetadata);
    console.timeEnd("Function #1");
    return JSON.stringify(newImagesMetadata);
  }
  // 6.9s
  @Get()
  findAll() {
    return this.imagesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.imagesService.findOne(+id);
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
