const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder, ChannelType, CommandInteraction } = require("discord.js")

require("dotenv").config();

module.exports = {
    data: new SlashCommandBuilder()
    .setName("addlogs")
    .setDescription("Nur zum testen (rp)")
    .addUserOption(option => option.setName("member").setDescription("Der User eben").setRequired(true)),
    /**
     * @param { CommandInteraction } interaction
    */
    async execute(interaction) {
        if (!interaction.member.id === "448763352299077632") return;
        const member = interaction.options.getUser("member");
        
        // interaction.guild.channels.cache.filter(channel => channel.type === 4 && channel.id === process.env.LOGS_CAT_ID);
        const results = interaction.guild.channels.cache.filter(channel => channel.parentId === process.env.LOGS_CAT_ID && channel.name === member.tag.replace("#", "").toLowerCase());
        if (results.size === 0) {
            const forum = await interaction.guild.channels.create({
                name: interaction.options.getUser("member").tag,
                type: ChannelType.GuildForum,
                parent: process.env.LOGS_CAT_ID
            });
            await forum.threads.create({ name: "level-logs", message: { embeds: [
                new EmbedBuilder()
                    .setTitle("Level Logs")
                    .setDescription(`In diesem Post stehen die Level Logs von ${member.tag}.`)
                    .setColor("Blue")
                ]}
            });
            await forum.threads.create({ name: "chat-command-logs", message: { embeds: [
                new EmbedBuilder()
                    .setTitle("Chat & Command Logs")
                    .setDescription(`In diesem Post stehen die Chat & Command Logs von ${member.tag}.`)
                    .setColor("Blue")
                ]}
            });
            await forum.threads.create({ name: "kill-death-logs", message: { embeds: [
                new EmbedBuilder()
                    .setTitle("Kill Logs")
                    .setDescription(`In diesem Post stehen die Kill und Death Logs von ${member.tag}.`)
                    .setColor("Blue")
                ]}
            });
            await forum.threads.create({ name: "join-logs", message: { embeds: [
                new EmbedBuilder()
                    .setTitle("Join Logs")
                    .setDescription(`In diesem Post stehen die Join Logs von ${member.tag}.`)
                    .setColor("Blue")
                ]}
            });
        };
        const forum = interaction.guild.channels.cache.find(channel => channel.name === interaction.options.getUser("member").tag.toLowerCase().replace("#", ""));
        await forum.threads.cache.find(thread => thread.name === "join-logs").send({ embeds: [
            new EmbedBuilder()
                .setTitle("Join Log")
                .setDescription(`${interaction.options.getUser("member").toString()} (PenisRPname)`)
                .addFields([
                    {
                        name: "Gejoint am",
                        value: `<t:${Math.floor(Date.now() / 1000)}>`
                    },
                    {
                        name: "ID",
                        value: "ID: **1**"
                    }
                ])
                .setColor("Blue")
        ]})
        await forum.threads.cache.find(thread => thread.name === "kill-death-logs").send({ embeds: [
            new EmbedBuilder()
                .setTitle("Kill Log")
                .setDescription(`${interaction.options.getUser("member").toString()} (PenisRPname)`)
                .addFields([
                    {
                        name: "ID",
                        value: "ID: **1**"
                    },
                    {
                        name: "Kill am",
                        value: `<t:${Math.floor(Date.now() / 1000)}>`
                    },
                    {
                        name: "Gekillt",
                        value: `${interaction.user.toString()} (RPName, **1**)`
                    }
                ])
                .setColor("Green")
        ]})
        await forum.threads.cache.find(thread => thread.name === "kill-death-logs").send({ embeds: [
            new EmbedBuilder()
                .setTitle("Death Log")
                .setDescription(`${interaction.options.getUser("member").toString()} (PenisRPname)`)
                .addFields([
                    {
                        name: "ID",
                        value: "ID: **1**"
                    },
                    {
                        name: "Death am",
                        value: `<t:${Math.floor(Date.now() / 1000)}>`
                    },
                    {
                        name: "Gekillt von",
                        value: `${interaction.user.toString()} (RPName, **1**)`
                    }
                ])
                .setColor("Red")
        ]})
        await forum.threads.cache.find(thread => thread.name === "chat-command-logs").send({ embeds: [
            new EmbedBuilder()
                .setTitle("Chat Log")
                .setDescription(`${interaction.options.getUser("member").toString()} (PenisRPname)`)
                .addFields([
                    {
                        name: "ID",
                        value: "ID: **1**"
                    },
                    {
                        name: "Nachricht am",
                        value: `<t:${Math.floor(Date.now() / 1000)}>`
                    },
                    {
                        name: "Nachricht",
                        value: "voll rp"
                    }
                ])
                .setColor("Blue")
        ]})
        await forum.threads.cache.find(thread => thread.name === "level-logs").send({ embeds: [
            new EmbedBuilder()
                .setTitle("Chat Log")
                .setDescription(`${interaction.options.getUser("member").toString()} (PenisRPname)`)
                .addFields([
                    {
                        name: "ID",
                        value: "ID: **1**"
                    },
                    {
                        name: "Levelup am",
                        value: `<t:${Math.floor(Date.now() / 1000)}>`
                    },
                    {
                        name: "Level",
                        value: "11"
                    }
                ])
                .setColor("Blue")
        ]})
    }
}