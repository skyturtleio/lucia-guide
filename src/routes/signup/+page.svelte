<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<h1>Sign up</h1>
<form method="POST" use:enhance>
	<label for="username">
		<span>Username</span>
		<input name="username" id="username" type="text" /><br />
	</label>
	<label for="password">
		<span>Password</span>
		<input name="password" id="password" type="password" /><br />
	</label>
	<button type="submit">Submit</button>
</form>

{#if form?.message}
	<p class="error">{form.message}</p>
{/if}
<a href="/login">Sign in</a>
