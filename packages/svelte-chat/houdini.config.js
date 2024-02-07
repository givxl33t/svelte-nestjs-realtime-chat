/// <references types="houdini-svelte">

/** @type {import('houdini').ConfigFile} */
const config = {
    "schemaPath": "../schema.gql",
    "watchSchema": {
        "url": "http://localhost:5000/graphql"
    },
    "plugins": {
        "houdini-svelte": {}
    },
    "scalars": {
        "DateTime": {
            "type": "Date",
            marshal(val) {
                return val.toISOString()
            },
            unmarshal(val) {
                return new Date(val)
            }
        }
    }
}

export default config
