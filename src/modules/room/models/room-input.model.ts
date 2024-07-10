import { Length } from "class-validator";

import { Field, ID, InputType } from "@nestjs/graphql";

@InputType()
export class CreateRoomInput {
  @Field()
  @Length(1, 255)
  name: string;
}

@InputType()
export class UpdateRoomInput {
  @Field(() => ID)
  roomId: string;

  @Field()
  @Length(1, 255)
  name: string;
}

@InputType()
export class DeleteOrLeaveRoomInput {
  @Field(() => ID)
  roomId: string;
}
