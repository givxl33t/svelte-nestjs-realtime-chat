<script>
// @ts-nocheck
	import { onMount } from 'svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';
	import { isAuthenticated } from '$lib/stores/auth';
	import { graphql } from '$houdini';

	$: isAuthenticatedValue = $isAuthenticated;

	let usersData = [];

	const store = graphql`
		query Users @load {
			users {
				id
				name
				email
				is_online
			}
		}
	`;

	onMount(async () => {
		const users = await store.fetch();
		usersData = users.data.users;
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
			const index = usersData.findIndex((user) => user.id === updatedUser.id);
			if (index !== -1) {
				usersData[index].is_online = updatedUser.is_online;
			}
		}
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
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
				{#if usersData.length > 0}
					<ul>
						{#each usersData as user}
							<li class="my-3">
								<a href={`/`}>
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
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}
</style>
