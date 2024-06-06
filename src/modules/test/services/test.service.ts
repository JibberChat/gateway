import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class TestService {
  constructor(@Inject('TEST_SERVICE') private client: ClientProxy) {}

  async test(): Promise<string> {
    return this.client.send<string>('test', '').toPromise();
  }
}
