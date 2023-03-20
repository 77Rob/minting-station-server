import { AiService } from "./../ai/ai.service";
import { Web3storageService } from "./../web3storage/web3storage.service";
import { StorageService } from "src/storage/storage.service";
import { Module } from "@nestjs/common";
import { ImagesService } from "./images.service";
import { ImagesController } from "./images.controller";
// import { FilesInterceptor } from "src/file-interceptor/file-interceptor";

@Module({
  controllers: [ImagesController],
  providers: [
    Web3storageService,
    AiService,
    ImagesService,
    StorageService,
    // FilesInterceptor,
  ],
})
export class ImagesModule {}
