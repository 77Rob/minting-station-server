import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as bodyParser from "body-parser";
const fileMiddleware = require("express-multipart-file-parser");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(fileMiddleware);

  await app.listen(5000);
}
bootstrap();
