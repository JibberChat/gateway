import { firstValueFrom, timeout } from "rxjs";

import { Inject } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ClientProxy } from "@nestjs/microservices";

import { CreateRoomInput, DeleteOrLeaveRoomInput, UpdateRoomInput } from "../models/room-input.model";
import { ChatRoom } from "../models/room-object.model";

import { CHAT_SERVICE } from "@infrastructure/configuration/model/chat-service.configuration";

@Resolver()
export class RoomResolver {
  constructor(@Inject(CHAT_SERVICE) private readonly chatServiceClient: ClientProxy) {}

  @Query(() => [ChatRoom])
  async getUserRooms(): Promise<ChatRoom | []> {
    const data = await firstValueFrom(
      this.chatServiceClient.send({ cmd: "getUserRooms" }, { userId: "1" }).pipe(timeout(5000))
    );
    return data;
  }

  @Query(() => [ChatRoom])
  async getUnreadUserRooms(): Promise<ChatRoom> {
    const data = await firstValueFrom(
      this.chatServiceClient.send({ cmd: "getUnreadUserRooms" }, { userId: "1" }).pipe(timeout(5000))
    );
    return data;
  }

  @Mutation(() => ChatRoom)
  async createRoom(@Args("createRoomInput") createRoomInput: CreateRoomInput): Promise<ChatRoom> {
    const data = await firstValueFrom(
      this.chatServiceClient
        .send({ cmd: "createRoom" }, { name: createRoomInput.name, userId: "1" })
        .pipe(timeout(5000))
    );
    return data;
  }

  @Mutation(() => ChatRoom)
  async updateRoom(@Args("updateRoomInput") updateRoomInput: UpdateRoomInput) {
    const data = await firstValueFrom(
      this.chatServiceClient.send({ cmd: "updateRoom" }, updateRoomInput).pipe(timeout(5000))
    );
    return data;
  }

  @Mutation(() => Boolean)
  async deleteRoom(@Args("deleteRoomInput") deleteRoomInput: DeleteOrLeaveRoomInput) {
    const data = await firstValueFrom(
      this.chatServiceClient.send({ cmd: "deleteRoom" }, { ...deleteRoomInput, userId: "1" }).pipe(timeout(5000))
    );
    return data.success;
  }

  @Mutation(() => Boolean)
  async leaveRoom(@Args("leaveRoomInput") leaveRoomInput: DeleteOrLeaveRoomInput) {
    const data = await firstValueFrom(
      this.chatServiceClient.send({ cmd: "leaveRoom" }, { ...leaveRoomInput, userId: "1" }).pipe(timeout(5000))
    );
    return data.success;
  }
}
