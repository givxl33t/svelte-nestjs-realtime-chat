import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BookService } from "src/books/books.service";
import { BookResolver } from "src/books/books.resolver";
import { Book, BookSchema } from "src/books/book.model";
import { UsersModule } from "src/users/users.module";

@Module({
  providers: [
    BookService,
    BookResolver,
    UsersModule
  ],
  imports: [MongooseModule.forFeature([
    {
      name: Book.name,
      schema: BookSchema
    }
  ])]
})

export class BooksModule {}