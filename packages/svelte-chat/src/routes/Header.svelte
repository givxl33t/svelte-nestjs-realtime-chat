<!-- Header.svelte -->
<script>
// @ts-nocheck
	import Swal from 'sweetalert2';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { isAuthenticated, currentUser, updateCurrentUser } from '$lib/stores/auth';
	import logo from '$lib/images/svelte-logo.svg';
	import github from '$lib/images/github.svg';
	import { graphql } from '$houdini';

	$: user = $currentUser;
	$: isAuthenticatedValue = $isAuthenticated;

	const store = graphql`
		query Me {
			me {
				id
				name
				email
			}
		}`;
		
	onMount(async () => {
		const user = await store.fetch();

		if (user.data) {
			isAuthenticated.set(true);
		} else {
			isAuthenticated.set(false);
		}

		updateCurrentUser(user.data);
	});

	async function handleLogout() {
		const logout = graphql`
			mutation Logout {
				logout
			}
		`;

		const res = await logout.mutate();

		if (res.data.logout) {
			isAuthenticated.set(false);
			updateCurrentUser(null);
		} else {
			console.error('Failed to logout');
		}
	}

	async function logoutConfirmation() {
		Swal.fire({
			title: 'Are you sure?',
			text: 'You will be logged out',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, log me out!',
		}).then((result) => {
			if (result.isConfirmed) {
				handleLogout();
			}
		});
	}
</script>

<header>
	<div class="corner">
		{#if isAuthenticatedValue}
		<p class="mt-2 ml-3 text-orange-500 font-semibold">{user.me.name}</p>
		{:else}
			<a href="https://kit.svelte.dev">
				<img src={logo} alt="SvelteKit" />
			</a>
		{/if}
	</div>

	<nav>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul>
			<li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
				<a href="/">Home</a>
			</li>
			{#if !isAuthenticatedValue}
				<li aria-current={$page.url.pathname === '/login' ? 'page' : undefined}>
					<a href="/login">Login</a>
				</li>
			{:else}
				<li aria-current={$page.url.pathname === '/logout' ? 'page' : undefined}>
					<a href="/" on:click={logoutConfirmation}>Logout</a>
				</li>
			{/if}
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>

	<div class="corner">
			<a href="https://github.com/sveltejs/kit">
				<img src={github} alt="GitHub" />
			</a>
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		overflow: hidden;
	}

	.corner {
		width: 3em;
		height: 3em;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}

	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--color-theme-1);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: var(--color-text);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--color-theme-1);
	}
</style>
