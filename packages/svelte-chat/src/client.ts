import { HoudiniClient } from '$houdini';
import { createClient } from 'graphql-ws';
import { subscription } from '$houdini/plugins';

export default new HoudiniClient({
    url: 'http://localhost:5000/graphql',
    fetchParams: () => {
        return {
            credentials: 'include',
        };
    },
    plugins: [
        subscription(() => createClient({
            url: 'ws://localhost:5000/graphql',
        }))
    ],
})