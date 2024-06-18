import { firstValueFrom, timeout } from "rxjs";

import { Inject } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ClientProxy } from "@nestjs/microservices";

import { User } from "./user.model";

import { USER_SERVICE } from "@infrastructure/configuration/model/user-service.configuration";

@Resolver()
export class UserResolver {
  constructor(@Inject(USER_SERVICE) private readonly userServiceClient: ClientProxy) {}

  @Query(() => User)
  async getMe(): Promise<User> {
    const data = await firstValueFrom(
      this.userServiceClient.send({ cmd: "getMe" }, { userId: "1" }).pipe(timeout(5000))
    );
    return data;
  }

  @Query(() => User)
  async getUserProfile(@Args("userId") userId: string): Promise<User> {
    const data = await firstValueFrom(
      this.userServiceClient.send({ cmd: "getUserProfile" }, { userId }).pipe(timeout(5000))
    );
    return data;
  }

  @Mutation(() => User)
  async updateUser(
    @Args("userId") userId: string,
    @Args("name") name: string,
    @Args("email") email: string
  ): Promise<User> {
    const data = await firstValueFrom(
      this.userServiceClient.send({ cmd: "updateUser" }, { userId, name, email }).pipe(timeout(5000))
    );
    return data;
  }
}
