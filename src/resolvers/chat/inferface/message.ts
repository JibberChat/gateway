import { InputType, Field, ObjectType } from '@nestjs/graphql';

@InputType()
export class SendMessageInput {
  @Field()
  userId: string;

  @Field()
  message: string;
}

@ObjectType()
export class SendMessage {
  @Field()
  userId: string;

  @Field()
  message: string;
}
