<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<h1>Sign In</h1>

<form method="POST" use:enhance>
	<label for="email">
		<span>Email</span>
		<input name="email" id="email" />
	</label>
	<label for="password">
		<span>Password</span>
		<input name="password" id="password" />
		<button type="submit">Submit</button>
	</label>
</form>

<a href="/signup">Don't have an account? Sign up</a>
