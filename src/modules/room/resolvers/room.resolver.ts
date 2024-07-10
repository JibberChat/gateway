import { GetUser } from "@decorators/get-user.decorator";
import { firstValueFrom, timeout } from "rxjs";

import { Inject } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ClientProxy } from "@nestjs/microservices";

import { CreateRoomInput, DeleteOrLeaveRoomInput, UpdateRoomInput } from "../models/room-input.model";
import { ChatRoom } from "../models/room-object.model";

import { CHAT_SERVICE } from "@infrastructure/configuration/model/chat-service.configuration";

import { GetUserEntity } from "@modules/user/entities/user.entity";

@Resolver()
export class RoomResolver {
  constructor(@Inject(CHAT_SERVICE) private readonly chatServiceClient: ClientProxy) {}

  @Query(() => [ChatRoom])
  async getUserRooms(@GetUser() user: GetUserEntity): Promise<ChatRoom | []> {
    return await firstValueFrom(
      this.chatServiceClient.send({ cmd: "getUserRooms" }, { userId: user.id }).pipe(timeout(5000))
    );
  }

  @Query(() => [ChatRoom])
  async getUnreadUserRooms(@GetUser() user: GetUserEntity): Promise<ChatRoom> {
    return await firstValueFrom(
      this.chatServiceClient.send({ cmd: "getUnreadUserRooms" }, { userId: user.id }).pipe(timeout(5000))
    );
  }

  @Mutation(() => ChatRoom)
  async createRoom(
    @GetUser() user: GetUserEntity,
    @Args("createRoomInput") createRoomInput: CreateRoomInput
  ): Promise<ChatRoom> {
    return await firstValueFrom(
      this.chatServiceClient
        .send({ cmd: "createRoom" }, { name: createRoomInput.name, userId: user.id })
        .pipe(timeout(5000))
    );
  }

  @Mutation(() => ChatRoom)
  async updateRoom(@Args("updateRoomInput") updateRoomInput: UpdateRoomInput) {
    return await firstValueFrom(
      this.chatServiceClient.send({ cmd: "updateRoom" }, updateRoomInput).pipe(timeout(5000))
    );
  }

  @Mutation(() => Boolean)
  async deleteRoom(@GetUser() user: GetUserEntity, @Args("deleteRoomInput") deleteRoomInput: DeleteOrLeaveRoomInput) {
    const data = await firstValueFrom(
      this.chatServiceClient.send({ cmd: "deleteRoom" }, { ...deleteRoomInput, userId: user.id }).pipe(timeout(5000))
    );
    return data.success;
  }

  @Mutation(() => Boolean)
  async leaveRoom(@GetUser() user: GetUserEntity, @Args("leaveRoomInput") leaveRoomInput: DeleteOrLeaveRoomInput) {
    const data = await firstValueFrom(
      this.chatServiceClient.send({ cmd: "leaveRoom" }, { ...leaveRoomInput, userId: user.id }).pipe(timeout(5000))
    );
    return data.success;
  }
}
