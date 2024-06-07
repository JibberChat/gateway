import { USER_SERVICE } from '@infrastructure/configuration/model/user-service.configuration';
import { Inject } from '@nestjs/common';
import { Resolver, Query } from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

@Resolver()
export class UserResolver {
  constructor(
    @Inject(USER_SERVICE) private readonly userServiceClient: ClientProxy,
  ) {}

  // Query
  @Query(() => String)
  async getUsers(): Promise<string> {
    const data = await firstValueFrom(
      this.userServiceClient.send({ cmd: 'getUsers' }, {}).pipe(timeout(5000)),
    );
    return data;
  }
}
