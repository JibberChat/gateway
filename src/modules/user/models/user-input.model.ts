import { IsEmail, Length } from "class-validator";

import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateUserInput {
  @Field()
  @Length(1, 255)
  name: string;

  @Field()
  @IsEmail()
  email: string;
}

@InputType()
export class UpdateUserInput {
  @Field()
  @Length(1, 255)
  name: string;
}
