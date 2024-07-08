import { PrometheusModule } from "@willsoto/nestjs-prometheus";
import { DirectiveLocation, GraphQLDirective } from "graphql";
import { join } from "path";

import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { ConfigurationModule } from "@infrastructure/configuration/configuration.module";
import { CHAT_SERVICE } from "@infrastructure/configuration/model/chat-service.configuration";
import { MEDIA_SERVICE } from "@infrastructure/configuration/model/media-service.configuration";
import { USER_SERVICE } from "@infrastructure/configuration/model/user-service.configuration";
import { ConfigurationService } from "@infrastructure/configuration/services/configuration.service";
import { HealthModule } from "@infrastructure/health/health.module";
import { LoggerModule } from "@infrastructure/logger/logger.module";

import { ChatResolver } from "@resolvers/chat/chat.resolver";
import { MediaResolver } from "@resolvers/media/media.resolver";
import { RoomResolver } from "@resolvers/room/room.resolver";
import { UserResolver } from "@resolvers/user/user.resolver";

import { upperDirectiveTransformer } from "@common/directives/uper-case.directive";

@Module({
  imports: [
    ConfigurationModule,
    HealthModule,
    LoggerModule,
    PrometheusModule.register(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      sortSchema: true,
      transformSchema: (schema) => upperDirectiveTransformer(schema, "upper"),
      playground: true,
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: "upper",
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
      subscriptions: {
        "graphql-ws": {
          path: "/subscriptions",
          onConnect: () => {
            console.log("Connected to websocket");
          },
        },
      },
    }),
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
        {
          name: USER_SERVICE,
          imports: [ConfigurationModule],
          useFactory: (configService: ConfigurationService) => {
            const userServiceOptions = configService.userServiceConfig;
            return {
              transport: Transport.TCP,
              options: {
                host: userServiceOptions.host,
                port: userServiceOptions.port,
              },
            };
          },
          inject: [ConfigurationService],
        },
        {
          name: CHAT_SERVICE,
          imports: [ConfigurationModule],
          useFactory: (configService: ConfigurationService) => {
            const chatServiceOptions = configService.chatServiceConfig;
            return {
              transport: Transport.TCP,
              options: {
                host: chatServiceOptions.host,
                port: chatServiceOptions.port,
              },
            };
          },
          inject: [ConfigurationService],
        },
        {
          name: MEDIA_SERVICE,
          imports: [ConfigurationModule],
          useFactory: (configService: ConfigurationService) => {
            const mediaServiceOptions = configService.mediaServiceConfig;
            return {
              transport: Transport.TCP,
              options: {
                host: mediaServiceOptions.host,
                port: mediaServiceOptions.port,
              },
            };
          },
          inject: [ConfigurationService],
        },
      ],
    }),
  ],
  providers: [UserResolver, ChatResolver, RoomResolver, MediaResolver],
})
export class AppModule {}
