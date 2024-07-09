import { Field, ID, InputType, ObjectType } from "@nestjs/graphql";
import { IsEmail, Length } from "class-validator";

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class UserMessage {
  @Field()
  name: string;
}



@InputType()
export class CreateUserInput {
  @Field()
  @Length(1, 255)
  name: string;

  @Field()
  @IsEmail()
  email: string;
}
