import { Resolver } from '@nestjs/graphql';
import { TestService } from '../services/test.service';
import { Query } from '@nestjs/common';
import { Test } from '../model/test.model';

@Resolver((of) => Test)
export class TestResolver {
  constructor(private readonly testService: TestService) {}

  // Query
  @Query((returns) => String)
  async test(): Promise<string> {
    return 'Hello World!';
  }
}
