import { ApolloServerPlugin, GraphQLRequestListener } from "@apollo/server";

import { Plugin } from "@nestjs/apollo";

@Plugin()
export class LoggingPlugin implements ApolloServerPlugin {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async requestDidStart(): Promise<GraphQLRequestListener<any>> {
    console.log("Request started");
    return {
      async willSendResponse() {
        console.log("Will send response");
      },
    };
  }
}
