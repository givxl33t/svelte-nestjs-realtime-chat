import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../users/user.model';
import { Message } from '../messages/message.model';
import * as mongoose from 'mongoose';

export type RoomDocument = Room & Document;

@ObjectType()
@Schema()
export class Room {
    @Field()
    id?: string;

    @Field(() => [User])
    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] })
    users?: User[];

    @Field(() => [Message])
    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Message', default: [] })
    messages?: Message[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);