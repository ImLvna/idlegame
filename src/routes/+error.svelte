<script lang="ts">
	import { page } from '$app/stores';

	const error = $page.error!;
</script>

<div class="size-full flex flex-col justify-center align-middle items-center">
	<h1 class="text-4xl">How did we get here?</h1>
	<div class="text-2xl">{error.message}</div>
</div>
