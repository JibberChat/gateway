import { catchError, firstValueFrom, timeout } from "rxjs";
import { pubSub } from "src/pubsub";

import { Inject } from "@nestjs/common";
import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { ClientProxy } from "@nestjs/microservices";

import { ChatMessage, SendMessageInput, SendMessageOutput } from "./models/message.model";
import { ChatRoom } from "./models/room.model";

import { CHAT_SERVICE } from "@infrastructure/configuration/model/chat-service.configuration";
import { LoggerService } from "@infrastructure/logger/services/logger.service";

@Resolver()
export class ChatResolver {
  constructor(
    @Inject(CHAT_SERVICE) private readonly chatServiceClient: ClientProxy,
    private readonly loggerService: LoggerService
  ) {}

  @Query(() => ChatRoom)
  async getUserRooms(): Promise<ChatRoom> {
    const data = await firstValueFrom(
      this.chatServiceClient.send({ cmd: "getUserRooms" }, { userId: "1" }).pipe(timeout(5000))
    );
    return data;
  }

  @Query(() => ChatRoom)
  async getUnreadUserRooms(): Promise<ChatRoom> {
    const data = await firstValueFrom(
      this.chatServiceClient.send({ cmd: "getUnreadUserRooms" }, { userId: "1" }).pipe(timeout(5000))
    );
    return data;
  }

  @Mutation(() => ChatRoom)
  async createRoom(@Args("name") name: string): Promise<ChatRoom> {
    const data = await firstValueFrom(
      this.chatServiceClient.send({ cmd: "createRoom" }, { name, userId: "1" }).pipe(timeout(5000))
    );
    return data;
  }

  @Mutation(() => ChatRoom)
  async updateRoom(@Args("roomId") roomId: string, @Args("name") name: string) {
    const data = await firstValueFrom(
      this.chatServiceClient.send({ cmd: "updateRoom" }, { roomId, name }).pipe(timeout(5000))
    );
    return data;
  }

  @Mutation(() => Boolean)
  async deleteRoom(@Args("roomId") roomId: string) {
    const data = await firstValueFrom(
      this.chatServiceClient.send({ cmd: "deleteRoom" }, { roomId }).pipe(timeout(5000))
    );
    return data.success;
  }

  @Mutation(() => Boolean)
  async leaveRoom(@Args("roomId") roomId: string) {
    const data = await firstValueFrom(
      this.chatServiceClient.send({ cmd: "leaveRoom" }, { roomId }).pipe(timeout(5000))
    );
    return data.success;
  }

  // Query
  @Query(() => String)
  async getMessages(): Promise<string> {
    const data = await firstValueFrom(this.chatServiceClient.send({ cmd: "getMessages" }, {}).pipe(timeout(5000)));
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

    await firstValueFrom(
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
    pubSub.publish("userJoinedRoom-" + roomId, { userId: "12", message });
    return { userId: "12", message };
  }

  @Subscription(() => ChatMessage, {
    resolve: (payload) => payload,
  })
  userJoinedRoom(@Args("roomId") roomId: string) {
    // TODO: check if user is not already in the room and authorized to join the room
    return pubSub.asyncIterator(`userJoinedRoom-${roomId}`);
  }
}
