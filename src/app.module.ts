import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { StorageModule } from "./storage/storage.module";
import { MediaModule } from "./media/media.module";
import { ImagesModule } from "./images/images.module";
import { Web3storageModule } from "./web3storage/web3storage.module";
import { CollectionModule } from "./collection/collection.module";
import { AiModule } from "./ai/ai.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    StorageModule,
    MediaModule,
    ImagesModule,
    Web3storageModule,
    CollectionModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
