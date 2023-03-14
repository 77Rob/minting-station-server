import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { FirestoreModule } from "./firestore/firestore.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { StorageModule } from "./storage/storage.module";
import { MediaModule } from "./media/media.module";
import { ImagesModule } from './images/images.module';
import { Web3storageModule } from './web3storage/web3storage.module';
import { CollectionModule } from './collection/collection.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FirestoreModule.forRoot({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        keyFilename: configService.get<string>("./sa_key.json"),
        projectId: configService.get<string>("ethdubai-886c4"),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    StorageModule,
    MediaModule,
    ImagesModule,
    Web3storageModule,
    CollectionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
