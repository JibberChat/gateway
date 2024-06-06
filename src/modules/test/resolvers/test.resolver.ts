import { Resolver, Query } from '@nestjs/graphql';
import { TestService } from '../services/test.service';

@Resolver()
export class TestResolver {
  constructor(private readonly testService: TestService) {}

  // Query
  @Query(() => String)
  async test(): Promise<string> {
    return 'Hello World!';
  }
}
