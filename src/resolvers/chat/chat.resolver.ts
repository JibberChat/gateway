import { CHAT_SERVICE } from '@infrastructure/configuration/model/chat-service.configuration';
import { Inject } from '@nestjs/common';
import { Resolver, Query } from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

@Resolver()
export class ChatResolver {
  constructor(
    @Inject(CHAT_SERVICE) private readonly chatServiceClient: ClientProxy,
  ) {}

  // Query
  @Query(() => String)
  async getMessages(): Promise<string> {
    const data = await firstValueFrom(
      this.chatServiceClient
        .send({ cmd: 'getMessages' }, {})
        .pipe(timeout(5000)),
    );
    return data;
  }
}
