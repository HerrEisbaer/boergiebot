require("dotenv").config();
const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const commands = [];

const commandFiles = fs.readdirSync("./src/commands").filter(file => file.endsWith(".js"));

commandFiles.forEach(commandFile => {
    const command = require(`./commands/${commandFile}`);
    commands.push(command.data.toJSON());
});

const contextFiles = fs.readdirSync("./src/commands/context").filter(file => file.endsWith(".js"));

contextFiles.forEach(contextFile => {
    const command = require(`./commands/context/${contextFile}`);
    commands.push(command.data.toJSON());
});

const restClient = new REST({version: "10"}).setToken(process.env.DISCORD_BOT_TOKEN);

restClient.put(Routes.applicationGuildCommands(process.env.DISCORD_APPLICATION_ID, process.env.DISCORD_GUILD_ID), { body: commands })
.then(() => console.log("Sucessfully registered commands"))
.catch(console.error);