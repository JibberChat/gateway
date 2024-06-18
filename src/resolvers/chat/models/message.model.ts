import { Field, InputType, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ChatMessage {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  message: string;
}
@ObjectType()
export class ChatMessages {
  @Field(() => [ChatMessage])
  messages: ChatMessage[];
}
