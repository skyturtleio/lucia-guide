<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<h1>Login</h1>

<form method="POST" use:enhance>
	<label for="email">
		<span>Email</span>
		<input name="email" id="email" type="text" />
	</label>
	<label for="password">
		<span>Password</span>
		<input name="password" id="password" type="password" />
		<button type="submit">Submit</button>
	</label>
</form>

{#if form?.message}
	<p class="error">{form.message}</p>
{/if}
<a href="/signup">Don't have an account? Sign up</a>
