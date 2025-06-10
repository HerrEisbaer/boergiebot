const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");

require("dotenv").config();

module.exports = {
    data: new SlashCommandBuilder()
    .setName("sendrulesembed")
    .setDescription("rp"),
    async execute(interaction) {
        if (!interaction.member.id === "448763352299077632") return;
        interaction.guild.rulesChannel.send({ embeds: [
            new EmbedBuilder()
                .setTitle("Regeln")
                .setDescription("Herzlich Willkommen auf Iceberg Gangwar. \n\nUm auf unserem Server spielen zu können, musst du die Regeln akzeptieren. \n Die Discordregeln findest du hier.\n ")
                .addFields([
                    // {
                    //     name: "VDM",
                    //     value: "Das **absichtliche** Überfahren von Spielern (VDM) ist ohne Ausnahme verboten. Ebenfalls zählt das Rammen eines Motorrads, damit der Fahrer herunterfällt, ebenfalls unter VDM"
                    // }
                    {
                        name: "Discord ToS",
                        value: "Das wichtigste ist, die ToS von Discord einzuhalten. Die ToS findest du hier: \n https://discord.com/terms"
                    }
                ])
                .setColor("Blue")
        ], components: [
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("acceptrules")
                        .setLabel('Regeln akzeptieren')
                        .setStyle(3)
                        .setEmoji('✅'),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setLabel("Regelwerk")
                        .setStyle(5)
                        .setURL("https://twitch.tv/herreisbaer")
                )
        ]});
    }
}