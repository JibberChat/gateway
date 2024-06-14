import { Field, InputType, ObjectType } from "@nestjs/graphql";

@InputType()
export class SendMessageInput {
  @Field()
  userId: string;

  @Field()
  message: string;
}

@ObjectType()
export class SendMessageOutput {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  message: string;
}

@ObjectType()
export class ChatMessage {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field()
  message: string;
}
