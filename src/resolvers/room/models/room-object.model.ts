import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ChatRoom {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  // @Field(() => [ChatMessage])
  // messages: ChatMessage[];
}
