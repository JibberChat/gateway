import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Media {
  @Field(() => ID)
  id: string;

  @Field()
  url: string;

  @Field()
  uploadedAt: Date;
}
