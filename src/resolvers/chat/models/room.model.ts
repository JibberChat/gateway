import { Field, ID, ObjectType } from "@nestjs/graphql";

// import { ChatMessage } from "./message.model";

@ObjectType()
export class ChatRoom {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  // @Field(() => [ChatMessage])
  // messages: ChatMessage[];
}
