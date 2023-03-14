import { Module } from "@nestjs/common";
import { Web3storageService } from "./web3storage.service";

@Module({
  providers: [Web3storageService],
  controllers: [],
})
export class Web3storageModule {}
