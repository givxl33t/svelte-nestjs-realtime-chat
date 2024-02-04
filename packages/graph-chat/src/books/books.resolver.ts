import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Book } from './book.model';
import { BookService } from 'src/books/books.service';
import { BookInput } from 'src/books/book.input';
import { JwtAuthGuard } from 'src/guards/jwtAuth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => Book)
export class BookResolver {
  constructor(
    private readonly bookService: BookService,
  ) {}

  @Query(() => [Book])
  @UseGuards(JwtAuthGuard)
  async books(): Promise<Book[]> {
    return this.bookService.findAll();
  }

  @Query(() => Book)
  async book(@Args('id', { type: () => ID }) id: string): Promise<Book> {
    return this.bookService.findOne(id);
  }

  @Mutation(() => Book)
  async createBook(@Args('input') input: BookInput): Promise<Book> {
    return this.bookService.create(input);
  }

  @Mutation(() => Book)
  async updateBook(
    @Args('id', { type: () => ID}) id: string,
    @Args('input') input: BookInput,
  ): Promise<Book> {
    return this.bookService.update(id, input);
  }

  @Mutation(() => Book)
  async deleteBook(@Args('id', { type: () => ID }) id: string): Promise<Book> {
    return this.bookService.delete(id);
  }
}