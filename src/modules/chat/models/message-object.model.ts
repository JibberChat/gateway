import { Field, ObjectType } from "@nestjs/graphql";

import { UserMessage } from "@modules/user/models/user.model";

@ObjectType()
export class ChatMessage {
  @Field()
  id: string;

  @Field()
  text: string;

  @Field(() => Date)
  createdAt: Date;

  @Field()
  user: UserMessage;
}
