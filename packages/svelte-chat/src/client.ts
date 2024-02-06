import { HoudiniClient } from '$houdini';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { browser } from '$app/environment';
import { subscription } from '$houdini/plugins';

const accessToken = browser ? localStorage.getItem('access_token') : '';

function createClient() {
    const client = new SubscriptionClient('ws://localhost:5000/graphql', {
        reconnect: true,
    });

    return {
        subscribe(payload: any, handlers: any) {
            const { unsubscribe } = client.request(payload).subscribe(handlers);

            return unsubscribe
        }
    }
}

export default new HoudiniClient({
    url: 'http://localhost:5000/graphql',
    fetchParams: () => {
        return {
            headers: {
                authorization: `Bearer ${accessToken}`,
            },
        };
    },
    plugins: [subscription(createClient)],
})
