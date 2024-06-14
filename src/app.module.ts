import { DirectiveLocation, GraphQLDirective } from "graphql";
import { join } from "path";

import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";

import { ConfigurationModule } from "@infrastructure/configuration/configuration.module";
import { CHAT_SERVICE } from "@infrastructure/configuration/model/chat-service.configuration";
import { MEDIA_SERVICE } from "@infrastructure/configuration/model/media-service.configuration";
import { USER_SERVICE } from "@infrastructure/configuration/model/user-service.configuration";
import { ConfigurationService } from "@infrastructure/configuration/services/configuration.service";
import { LoggerModule } from "@infrastructure/logger/logger.module";

import { ChatResolver } from "@resolvers/chat/chat.resolver";
import { MediaResolver } from "@resolvers/media/media.resolver";
import { UserResolver } from "@resolvers/user/user.resolver";

import { upperDirectiveTransformer } from "@common/directives/uper-case.directive";

@Module({
  imports: [
    ConfigurationModule,
    LoggerModule,

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
          onConnect: (context) => {
            console.log("Connected to websocket");
          },
        },
      },
    }),
  ],
  providers: [
    UserResolver,
    ChatResolver,
    MediaResolver,

    {
      provide: USER_SERVICE,
      useFactory: (configService: ConfigurationService) => {
        const userServiceOptions = configService.userServiceConfig;
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: userServiceOptions.host,
            port: userServiceOptions.port,
          },
        });
      },
      inject: [ConfigurationService],
    },
    {
      provide: CHAT_SERVICE,
      useFactory: (configService: ConfigurationService) => {
        const chatServiceOptions = configService.chatServiceConfig;
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: chatServiceOptions.host,
            port: chatServiceOptions.port,
          },
        });
      },
      inject: [ConfigurationService],
    },
    {
      provide: MEDIA_SERVICE,
      useFactory: (configService: ConfigurationService) => {
        const mediaServiceOptions = configService.mediaServiceConfig;
        return ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: mediaServiceOptions.host,
            port: mediaServiceOptions.port,
          },
        });
      },
      inject: [ConfigurationService],
    },
  ],
})
export class AppModule {}
