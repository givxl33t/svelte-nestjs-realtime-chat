<script>
  import { currentUser } from '$lib/stores/auth';
  import { graphql } from '$houdini';
  import { page } from '$app/stores';

  /** @type { import('./$houdini').PageData } */
  export let data;

  $: user = $currentUser;
  $: ({ Room } = data)
  $: currentRoom = $Room?.data?.room;

  const listener = graphql`
    subscription MessageCreated {
      messageCreated {
        id
        text
        createdAt
        user {
          id
          name
        }
        room {
          id
        }
      }
    }
  `;

  const message = graphql`
    mutation CreateMessage($room: String!, $text: String!) {
      createMessage(input: { room: $room, text: $text }) {
        id
        text
        createdAt
        user {
          id
          name
        }
      }
    }
  `

  $: listener.listen();
  $: {
    if ($listener.data) {
      Room.fetch({ policy: 'NetworkOnly' })
    }
  }

  let messageText = '';

  async function sendMessage() {
    if (messageText) {
      await message.mutate({ room: $page.params.roomId, text: messageText })
      Room.fetch({ policy: 'NetworkOnly' })
      messageText = '';
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center">
  {#if currentRoom}
    <div class="max-w-md w-full">
      <h1 class="text-3xl font-bold mb-4">Chat Room</h1>

      <div class="border-t border-b overflow-y-auto max-h-96 p-4">
        {#each currentRoom.messages as message (message.id) }
          <div class="mb-4 { message.user.id === user.me.id ? "text-right ml-auto" : "text-left" }">
            <p class="text-gray-500 mb-1">{message.user.name}:</p>
            <p>{message.text}</p>
            <p class="text-xs text-gray-400">{message.createdAt.toLocaleString()}</p>
          </div>
        {/each}
      </div>

      <!-- Add message input and send button here -->
      <form class="flex" on:submit|preventDefault={sendMessage}>
        <input
          type="text"
          class="flex-1 border border-gray-300 rounded p-2"
          placeholder="Type your message..."
          bind:value={messageText}
        />
        <button
          type="submit"
          class="bg-blue-500 text-white rounded p-2 ml-2"
        >
          Send
        </button>
    </div>
  {:else}
    <p>Loading...</p>
  {/if}
</div>