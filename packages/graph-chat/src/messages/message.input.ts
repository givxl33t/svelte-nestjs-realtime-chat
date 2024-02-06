import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class MessageInput {
  @Field()
  room: string;

  @Field()
  text: string;
}