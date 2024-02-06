import { Field, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { User } from "../users/user.model";
import { Room } from "src/rooms/room.model";
import * as mongoose from "mongoose";

export type MessageDocument = Message & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Message {
    @Field()
    id?: string;

    @Field(() => Room)
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Room'})
    room: string;

    @Field(() => User)
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User;

    @Field()
    @Prop({ type: String })
    text: string;

    @Field()
    @Prop({ type: Date })
    createdAt?: Date;

    @Field()
    @Prop({ type: Date })
    updatedAt?: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

