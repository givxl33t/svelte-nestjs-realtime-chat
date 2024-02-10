import { Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class PubSubService {
  public pubSub: PubSub;

  constructor() {
    this.pubSub = new PubSub();
  }

  getChannel(channelName: string) {
    return this.pubSub.asyncIterator(channelName);
  }

  publish(channelName: string, payload: any) {
    this.pubSub.publish(channelName, payload);
  }
}