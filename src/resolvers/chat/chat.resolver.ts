import { CHAT_SERVICE } from '@infrastructure/configuration/model/chat-service.configuration';
import { Inject } from '@nestjs/common';
import { Resolver, Query, Args, Mutation, Subscription } from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';
import { SendMessage, SendMessageInput } from './inferface/message';
import { SocketService } from 'src/modules/websocket.service';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver()
export class ChatResolver {
  constructor(
    @Inject(CHAT_SERVICE) private readonly chatServiceClient: ClientProxy,
    // private readonly socketService: SocketService,
  ) {}

  // Query
  @Query(() => String)
  async getMessages(): Promise<string> {
    const data = await firstValueFrom(
      this.chatServiceClient
        .send({ cmd: 'getMessages' }, {})
        .pipe(timeout(5000)),
    );
    console.log(data);
    return data;
  }

  @Mutation(() => SendMessage)
  async sendMessage(@Args('input') input: SendMessageInput) {
    console.log('input', input);
    await firstValueFrom(
      this.chatServiceClient
        .send({ cmd: 'createMessage' }, input)
        .pipe(timeout(5000)),
    );
    // this.socketService.emitEvent('message', input);
    pubSub.publish('messageAdded', { messageAdded: input });
    return input;
  }

  @Subscription(() => SendMessage)
  messageAdded() {
    return pubSub.asyncIterator('messageAdded');
    // return true;
  }
}
