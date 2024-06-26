import { json, urlencoded } from "express";
import helmet from "helmet";
import * as morgan from "morgan";

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";

import { ConfigurationService } from "@infrastructure/configuration/services/configuration.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigurationService);

  // app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // app.enableVersioning({ type: VersioningType.URI });

  // Middlewares
  app.use(morgan("dev"));
  app.use(json({ limit: "50mb" }));
  app.use(urlencoded({ extended: true, limit: "50mb" }));
  app.use(helmet({ contentSecurityPolicy: false }));
  app.enableCors();

  await app.listen(config.appConfig.port);
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
}
bootstrap();
