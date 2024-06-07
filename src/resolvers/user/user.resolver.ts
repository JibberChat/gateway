import { USER_SERVICE } from '@infrastructure/configuration/model/user-service.configuration';
import { Inject } from '@nestjs/common';
import { Resolver, Query } from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';

@Resolver()
export class UserResolver {
  constructor(
    @Inject(USER_SERVICE) private readonly userServiceClient: ClientProxy,
  ) {}

  // Query
  @Query(() => String)
  async getUsers(): Promise<string> {
    // await this.userServiceClient.send('test', {})

    return 'data';
  }
}
