import { Web3storageService } from "./../web3storage/web3storage.service";
import { StorageService } from "src/storage/storage.service";
import { Module } from "@nestjs/common";
import { ImagesService } from "./images.service";
import { ImagesController } from "./images.controller";

@Module({
  controllers: [ImagesController],
  providers: [Web3storageService, ImagesService, StorageService],
})
export class ImagesModule {}
