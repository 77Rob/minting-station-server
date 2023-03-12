import { StorageService } from "src/storage/storage.service";
import { Module } from "@nestjs/common";
import { ImagesService } from "./images.service";
import { ImagesController } from "./images.controller";

@Module({
  controllers: [ImagesController],
  providers: [ImagesService, StorageService],
})
export class ImagesModule {}
