import { HoudiniClient } from '$houdini';
import { browser } from '$app/environment';
import { createClient } from 'graphql-ws';
import { subscription } from '$houdini/plugins';

const accessToken = browser ? localStorage.getItem('access_token') : '';

export default new HoudiniClient({
    url: 'http://localhost:5000/graphql',
    fetchParams: () => {
        return {
            headers: {
                authorization: `Bearer ${accessToken}`,
            },
        };
    },
    plugins: [
        subscription(() => createClient({
            url: 'ws://localhost:5000/graphql',
        }))
    ],
})
