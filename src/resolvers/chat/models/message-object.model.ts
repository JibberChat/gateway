import { Field, ObjectType } from "@nestjs/graphql";

import { UserMessage } from "@resolvers/user/user.model";

@ObjectType()
export class ChatMessage {
  @Field()
  id: string;

  @Field()
  text: string;

  @Field()
  user: UserMessage;
}
