import { MEDIA_SERVICE } from '@infrastructure/configuration/model/media-service.configuration';
import { Inject } from '@nestjs/common';
import { Resolver, Query } from '@nestjs/graphql';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

@Resolver()
export class MediaResolver {
  constructor(
    @Inject(MEDIA_SERVICE) private readonly mediaServiceClient: ClientProxy,
  ) {}

  // Query
  @Query(() => String)
  async getMedias(): Promise<string> {
    const data = await firstValueFrom(
      this.mediaServiceClient
        .send({ cmd: 'getMedias' }, {})
        .pipe(timeout(5000)),
    );
    return data;
  }
}
