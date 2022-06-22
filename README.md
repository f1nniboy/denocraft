<h1 align="center">DenoCraft</h1>
<p align="center"><i>A library to control special structures on the <b><a href="https://mc.repl.game/">ReplCraft</a></b> Minecraft server</i></p>

## Motivation
This library was inspired by **[SirLennox/ReplCraft](https://github.com/SirLennox/ReplCraft)**, and aims to be a more complete
implementation of a ReplCraft client, compared to **[the official library](https://github.com/LeeFlemingRepl/replcraft-nodejs-client)**.

## Getting started
Simply include the `denocraft` library inside of your **Deno** project.

### *Connecting to the server*
```ts
import { Client } from "https://deno.land/x/denocraft/mod.ts";
const client = new Client();

await client.connect({
	token: Token.from("<your token>")
});
```

### *Placing a block*
**Note**: *The block has to be inside of the structure's chest.*
```ts
import { Client, Location, Block } from "https://deno.land/x/denocraft/mod.ts";

...

client.setBlock(Location.from(0, 0, 0)), Block.from("minecraft:cobblestone"));
```

### *Responding to transactions*
```ts
...

client.on("transaction", async transaction => {
	await transaction.tell(`Hello, ${transaction.player.name}!`);
	transaction.accept();
});
```

A few other examples are located inside of the `examples` folder.