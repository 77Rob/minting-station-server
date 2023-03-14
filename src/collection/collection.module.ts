import { Module } from "@nestjs/common";
import { CollectionService } from "./collection.service";
import { CollectionController } from "./collection.controller";
import { Web3storageService } from "src/web3storage/web3storage.service";
import { StorageService } from "src/storage/storage.service";
import { ImagesService } from "src/images/images.service";

@Module({
  providers: [
    CollectionService,
    Web3storageService,
    StorageService,
    ImagesService,
  ],
  controllers: [CollectionController],
})
export class CollectionModule {}
