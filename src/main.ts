import { json, urlencoded } from "express";
import helmet from "helmet";
import * as morgan from "morgan";

import { ValidationPipe } from "@nestjs/common";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";

import { ConfigurationService } from "@infrastructure/configuration/services/configuration.service";
import { GlobalExceptionFilter } from "@infrastructure/filter/global-exception.filter";
import { LoggerInterceptor } from "@infrastructure/logger/logger.interceptor";
import { LoggerService } from "@infrastructure/logger/services/logger.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigurationService);
  const loggerService = app.get(LoggerService);

  // app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // app.enableVersioning({ type: VersioningType.URI });

  // Middlewares
  app.use(morgan("dev"));
  app.use(json({ limit: "50mb" }));
  app.use(urlencoded({ extended: true, limit: "50mb" }));
  app.use(helmet({ contentSecurityPolicy: false }));
  app.enableCors();

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GlobalExceptionFilter(loggerService));
  app.useGlobalInterceptors(new LoggerInterceptor(loggerService));

  await app.listen(configService.appConfig.port);
  loggerService.info(`🚀 Application is running on: ${await app.getUrl()}`, "Bootstrap");
}
bootstrap();
