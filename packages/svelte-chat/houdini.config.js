/// <references types="houdini-svelte">

/** @type {import('houdini').ConfigFile} */
const config = {
    "schemaPath": "../schema.gql",
    "watchSchema": {
        "url": "http://localhost:5000/graphql"
    },
    "plugins": {
        "houdini-svelte": {}
    }
}

export default config
