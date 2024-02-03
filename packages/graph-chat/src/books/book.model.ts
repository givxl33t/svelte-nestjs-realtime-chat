import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookDocument = Book & Document;

@ObjectType()
@Schema()
export class Book {
    @Field()
    @Prop({ type: String })
    title: string;

    @Field()
    @Prop({ type: String })
    author: string;

    @Field()
    @Prop({ type: Boolean })
    publishedDate: boolean;
}

export const BookSchema = SchemaFactory.createForClass(Book);