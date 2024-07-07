import { firstValueFrom, timeout } from "rxjs";

import { Inject } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ClientProxy } from "@nestjs/microservices";

import { ChatRoom } from "./models/room.model";

import { CHAT_SERVICE } from "@infrastructure/configuration/model/chat-service.configuration";

@Resolver()
export class RoomResolver {
  constructor(@Inject(CHAT_SERVICE) private readonly chatServiceClient: ClientProxy) {}

  @Query(() => ChatRoom)
  async getUserRooms(): Promise<ChatRoom> {
    const data = await firstValueFrom(
      this.chatServiceClient.send({ cmd: "getUserRooms" }, { userId: "1" }).pipe(timeout(5000))
    );
    console.log(data);
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
}
