import { catchError, firstValueFrom, timeout } from "rxjs";
import { pubSub } from "src/pubsub";

import { Inject } from "@nestjs/common";
import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { ClientProxy } from "@nestjs/microservices";

import { ChatMessage } from "./models/message-object.model";

import { CHAT_SERVICE } from "@infrastructure/configuration/model/chat-service.configuration";
import { LoggerService } from "@infrastructure/logger/services/logger.service";

@Resolver()
export class ChatResolver {
  constructor(
    @Inject(CHAT_SERVICE) private readonly chatServiceClient: ClientProxy,
    private readonly loggerService: LoggerService
  ) {}

  @Query(() => [ChatMessage])
  async getRoomMessages(@Args("roomId") roomId: string): Promise<ChatMessage[]> {
    const data: ChatMessage[] = await firstValueFrom(
      this.chatServiceClient.send({ cmd: "getRoomMessages" }, { roomId: roomId }).pipe(timeout(5000))
    );
    return data;
  }

  @Mutation(() => ChatMessage)
  async sendMessage(@Args("roomId") roomId: string, @Args("message") message: string) {
    // const room = await firstValueFrom(
    //   this.chatServiceClient
    //     .send(
    //       { cmd: "getRoomOfUser" },
    //       {
    //         userId: "1",
    //       }
    //     )
    //     .pipe(
    //       timeout(5000),
    //       catchError((err) => {
    //         this.loggerService.error("Error getting room:", err);
    //         throw new Error("Error getting room");
    //       })
    //     )
    // );

    // if (!room || roomId !== room.id) throw new Error("User is not authorized to send message");

    const messageSent = await firstValueFrom(
      this.chatServiceClient
        .send(
          { cmd: "sendMessageToRoom" },
          {
            message,
            roomId: roomId,
          }
        )
        .pipe(
          timeout(5000),
          catchError((err) => {
            this.loggerService.error("Error sending message:", err);
            throw new Error("Error sending message");
          })
        )
    );

    pubSub.publish("userJoinedRoom-" + roomId, { id: messageSent.id, text: messageSent.text, user: messageSent.user });
    return { id: "1", text: message };
  }

  @Subscription(() => ChatMessage, {
    resolve: (payload) => payload,
  })
  userJoinedRoom(@Args("roomId") roomId: string) {
    // TODO: check if user is not already in the room and authorized to join the room
    return pubSub.asyncIterator(`userJoinedRoom-${roomId}`);
  }
}
