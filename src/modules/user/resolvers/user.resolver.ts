import { clerkClient } from "@clerk/clerk-sdk-node";
import { Cookies } from "@decorators/cookies.decorator";
import { GetUser } from "@decorators/get-user.decorator";
import { Public } from "@decorators/public.decorator";
import { firstValueFrom, timeout } from "rxjs";

import { Inject, UnauthorizedException } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ClientProxy } from "@nestjs/microservices";

import { GetUserEntity } from "../entities/user.entity";
import { CreateUserInput, UpdateUserInput } from "../models/user-input.model";
import { User } from "../models/user-object.model";

import { USER_SERVICE } from "@infrastructure/configuration/model/user-service.configuration";
import { ConfigurationService } from "@infrastructure/configuration/services/configuration.service";

@Resolver()
export class UserResolver {
  constructor(
    @Inject(USER_SERVICE) private readonly userServiceClient: ClientProxy,
    private readonly configService: ConfigurationService
  ) {}

  @Query(() => User)
  async getMe(@GetUser() user: GetUserEntity): Promise<User> {
    const data = await firstValueFrom(
      this.userServiceClient.send({ cmd: "getMe" }, { userId: user.id }).pipe(timeout(5000))
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

  @Public()
  @Mutation(() => User)
  async createUser(
    @Cookies("__session") clerkSession: string | undefined,
    @Args("createUserInput") createUserInput: CreateUserInput
  ) {
    const verify = await clerkClient.verifyToken(clerkSession, {
      jwtKey: this.configService.authConfig.jwtKey,
    });

    if (!verify) throw new UnauthorizedException();

    const data = await firstValueFrom(
      this.userServiceClient
        .send({ cmd: "createUser" }, { ...createUserInput, clerkId: verify.sub })
        .pipe(timeout(5000))
    );
    return data;
  }

  @Mutation(() => User)
  async updateUser(
    @Args("updateUserInput") updateUserInput: UpdateUserInput,
    @GetUser() user: GetUserEntity
  ): Promise<User> {
    const data = await firstValueFrom(
      this.userServiceClient.send({ cmd: "updateUser" }, { ...updateUserInput, userId: user.id }).pipe(timeout(5000))
    );
    return data;
  }
}
