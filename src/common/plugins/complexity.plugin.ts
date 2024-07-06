import { ApolloServerPlugin, GraphQLRequestListener } from "@apollo/server";
import { GraphQLError } from "graphql";
import { fieldExtensionsEstimator, getComplexity, simpleEstimator } from "graphql-query-complexity";

import { Plugin } from "@nestjs/apollo";
import { GraphQLSchemaHost } from "@nestjs/graphql";

import { LoggerService } from "@infrastructure/logger/services/logger.service";

@Plugin()
export class ComplexityPlugin implements ApolloServerPlugin {
  constructor(
    private gqlSchemaHost: GraphQLSchemaHost,
    private readonly loggerService: LoggerService
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async requestDidStart(): Promise<GraphQLRequestListener<any>> {
    const { schema } = this.gqlSchemaHost;

    return {
      async didResolveOperation({ request, document }) {
        const complexity = getComplexity({
          schema,
          operationName: request.operationName,
          query: document,
          variables: request.variables,
          estimators: [fieldExtensionsEstimator(), simpleEstimator({ defaultComplexity: 1 })],
        });

        if (complexity >= 20) {
          throw new GraphQLError(`Query is too complex: ${complexity}. Maximum allowed complexity: 20`);
        }
        // this.loggerService.info("Query Complexity: " + complexity, this.constructor.name);
      },
    };
  }
}
