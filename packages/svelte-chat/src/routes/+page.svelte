<script>
// @ts-nocheck
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';
	import { isAuthenticated } from '$lib/stores/auth';
	import { graphql } from '$houdini';
  import { usersData, updateUsers, updateSingleUser } from '$lib/stores/users';
	import Swal from 'sweetalert2';

	$: users = $usersData;
	$: isAuthenticatedValue = $isAuthenticated;

	const store = graphql`
		query Users {
			users {
				id
				name
				email
				is_online
			}
		}
	`;

	onMount(async () => {
		const users = await store.fetch({
			policy: "NetworkOnly"
		})
		updateUsers(users.data.users);
	});

	const listener = graphql`
		subscription UserStatusUpdated {
			userStatusUpdated {
				id
				is_online
			}
		}
	`;

	$: listener.listen();
	$: {
		if ($listener.data) {
			const updatedUser = $listener.data.userStatusUpdated;
			const index = users.findIndex((user) => user.id === updatedUser.id);
			if (index !== -1) {
				users[index].is_online = updatedUser.is_online;
				updateSingleUser(users[index]);
			}
		}
	}

	async function createChatRoom(userId) {
		const chatroom = graphql`
			mutation CreateRoom($recipientId: ID!) {
				createRoom(recipientId: $recipientId) {
					id
				}
			}
		`;

		const res = await chatroom.mutate({ recipientId: userId });
		goto(`/room/${res.data.createRoom.id}`);
	}

	async function handleUserClick(userId) {
		const roomToUser = graphql`
			query RoomToUser($to: ID!) {
				roomToUser(to: $to) {
					id
				}
			}`

		const room = await roomToUser.fetch({
			variables: {
				to: userId
			}
		});

		if (room.data !== null) {
			goto(`/room/${room.data.roomToUser.id}`);
		} else {
			Swal.fire({
				title: 'Create Chat Room?',
				text: 'You have not chatted with this user before. Do you want to create a chat room?',
				icon: 'info',
				confirmButtonText: 'Sure! Create it!',
				showCancelButton: true,
			}).then(async (result) => {
				if (result.isConfirmed) {
					await createChatRoom(userId);
				}
			});
		}
	}

</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo" />
</svelte:head>

<section>
	<h1>
		<span class="welcome">
			<picture>
				<source srcset={welcome} type="image/webp" />
				<img src={welcome_fallback} alt="Welcome" />
			</picture>
		</span>

		<p class="text-3xl font-bold text-center pb-5">Givmessenger App</p>

		<p class="text-2xl font-semibold underline text-center">Other Users</p>
		<div class="flex justify-center text-center">
			{#if isAuthenticatedValue}
				{#if users.length > 0}
					<ul>
						{#each users as user}
							<li class="my-3">
								<a href={`#`} on:click={() => handleUserClick(user.id)}>
									<div class="p-2 border-2 border-slate-400 shadow-md rounded-xl hover:shadow-xl transition duration-300">
										<p>ID : {user.id}</p>
										<p>{user.name}</p>
										<p>{user.email}</p>
										<p class="font-bold {user.is_online ? "text-green-600" : "text-red-600"}">
											{user.is_online ? 'Online' : 'Offline'}
										</p>
									</div>
								</a>
							</li>
						{/each}
					</ul>
				{:else}
					<p>No users found</p>
				{/if}
			{:else}
				<p>Please login to view users</p>
			{/if}
		</div>
	</h1>

	<h2>
		try editing <strong>src/routes/+page.svelte</strong>
	</h2>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
		z-index: -2;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
