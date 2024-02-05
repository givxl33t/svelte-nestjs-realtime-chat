<script>
	import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';

	export let data;

	const books = data.props?.data.books;
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

		<p class="text-2xl font-bold text-center pb-5">Books</p>
		<div class="flex justify-center text-center">
			{#if books}
				<ul>
					{#each books as book}
						<li class="{book.publishedDate ? "text-teal-600" : "text-red-600"} my-3">
							<p>ID : {book.id}</p>
							<p>{book.title} by {book.author}</p>
							<p>{book.publishedDate ? "Published" : "Not published"}</p>
						</li>
					{/each}
				</ul>
			{:else}
				<p>No books found</p>
			{/if}
		</div>
	</h1>

	<h2>
		try editing <strong>src/routes/+page.svelte</strong>
	</h2>

	<Counter />
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
