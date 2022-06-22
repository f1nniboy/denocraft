import { Client, Token } from "../mod.ts";

/* Create a new ReplCraft client instance. */
const client = new Client();

/* Connect to the Minecraft server. */
await client.connect({
	token: Token.from("eyJhbGciOiJIUzI1NiJ9.eyJob3N0IjoiMzQuNjkuMjM5LjEzMjoyODA4MCIsIndvcmxkIjoid29ybGQiLCJ4Ijo1OTYsInkiOjg1LCJ6IjoxNzE4LCJ1dWlkIjoiNTJlNzUxNDMtYTY1MS00NzU1LWIyMTYtMDQ5NzY4M2Y1M2JjIiwidXNlcm5hbWUiOiJmMW5uaWJveSIsInBlcm1pc3Npb24iOiJwbGF5ZXIifQ.A505L_JEAM4uDny3fnm7eNcwuBLNX4TSOy2-slD6w24")
});

/* Print a summary of the fuel usage every five seconds. */
setInterval(async () => {
	console.log(await client.getFuelInfo());
}, 5000);