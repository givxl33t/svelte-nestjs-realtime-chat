import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@ObjectType()
@Schema()
export class User {
    @Field()
    id?: string;

    @Field()
    @Prop({ type: String })
    name: string;

    @Field()
    @Prop({ type: String, unique: true })
    email: string;

    @Field()
    @Prop({ type: String })
    password: string;

    @Field()
    access_token?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);