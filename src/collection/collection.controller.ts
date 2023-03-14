import { Web3storageService } from "./../web3storage/web3storage.service";
import { Controller, Get, Param } from "@nestjs/common";
import { CollectionService } from "./collection.service";
import { StorageService } from "src/storage/storage.service";

@Controller("collection")
export class CollectionController {
  collections = {};
  constructor(
    private readonly web3storageService: Web3storageService,
    private storageService: StorageService
  ) {}

  @Get()
  getUserCollection(@Param("userId") userId: string) {
    if (!this.collections[userId]) {
      this.collections[userId] = {
        name: "My Collection",
        description: "My Collection Description",
        external_link: "",
        image: "",
      };
    }

    return this.collections[userId];
  }
}
