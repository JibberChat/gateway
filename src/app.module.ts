import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { upperDirectiveTransformer } from '@common/directives/uper-case.directive';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
import { UserResolver } from './resolvers/user/user.resolver';
import { ConfigurationModule } from '@infrastructure/configuration/configuration.module';
import { ConfigurationService } from '@infrastructure/configuration/services/configuration.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { USER_SERVICE } from '@infrastructure/configuration/model/user-service.configuration';
import { ChatResolver } from '@modules/chat/chat.resolver';
import { CHAT_SERVICE } from '@infrastructure/configuration/model/chat-service.configuration';

@Module({
  imports: [
    ConfigurationModule,

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      transformSchema: (schema) => upperDirectiveTransformer(schema, 'upper'),
      installSubscriptionHandlers: true,
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'upper',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
    }),
  ],
  providers: [
    UserResolver,
    ChatResolver,

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
  ],
})
export class AppModule {}
