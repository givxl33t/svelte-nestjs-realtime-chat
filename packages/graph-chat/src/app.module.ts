import { Module } from '@nestjs/common';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mongoDBConfig from './config/mongo.config';
import jwtConfig from './config/jwt.config';

import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { RoomsModule } from './rooms/rooms.module';
import { MessagesModule } from './messages/messages.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        mongoDBConfig,
        jwtConfig
      ],
      isGlobal: true,
    }),
    NestGraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile: join(process.cwd(), '../schema.gql'),
        context: ({ req, res }) => ({ req, res }),
        installSubscriptionHandlers: true,
        subscriptions: {
          "graphql-ws": true,
          "subscriptions-transport-ws": true,
        },
        sortSchema: true,
        playground: true,
        debug: configService.get<boolean>('DEBUG'),
        uploads: false,
      }),
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI')
      }),
    }),
    UsersModule,
    BooksModule,
    RoomsModule,
    MessagesModule,
    NotificationsModule,
  ],
})
export class AppModule {}
