import { Field, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { User } from "../users/user.model";
import * as mongoose from "mongoose";

export type NotificationDocument = Notification & Document;

@ObjectType()
class NotificationMetadata {
    @Field()
    key: string;

    @Field()
    value: string;
}

@ObjectType()
@Schema({ timestamps: true })
export class Notification {
    @Field()
    id?: string;

    @Field(() => User)
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    receiver: User;

    @Field()
    @Prop({ type: String })
    text: string;

    @Field(() => [NotificationMetadata])
    @Prop({ type: [Object] })
    metadata: NotificationMetadata[];

    @Field()
    @Prop({ type: Date })
    createdAt?: Date;

    @Field()
    @Prop({ type: Date })
    updatedAt?: Date;

    @Field()
    @Prop({ type: Boolean, default: false })
    read?: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);