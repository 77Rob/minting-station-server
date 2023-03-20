import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AiModule } from "./ai/ai.module";
import { CollectionModule } from "./collection/collection.module";
import { ImagesModule } from "./images/images.module";
import { StorageModule } from "./storage/storage.module";
import { Web3storageModule } from "./web3storage/web3storage.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    StorageModule,
    ImagesModule,
    Web3storageModule,
    CollectionModule,
    AiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
