import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => Date)
  createdAt: Date;
}

@ObjectType()
export class UserMessage {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;
}
