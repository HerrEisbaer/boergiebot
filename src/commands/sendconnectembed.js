const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder, CommandInteraction } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("sendconnectembed")
    .setDescription("vollrp"),
    /**
     * @param { CommandInteraction } interaction
     */
    async execute(interaction) {
        if (!interaction.member.id === "448763352299077632") return;
        const channel = interaction.guild.channels.cache.find(channel => channel.id === process.env.CONNECT_CHANNEL_ID);
        await channel.send({ embeds: [
            new EmbedBuilder()
                .setTitle("Verbinden")
                .addFields([
                    {
                        name: "F8 Konsole",
                        value: "connect 45.13.227.212", //45.13.227.212
                    },
                    {
                        name: "Serverliste",
                        value: "Suche \"Iceberg Gangwar\" in der FiveM Serverliste.",
                    },
                    {
                        name: "Benötigter Rang",
                        value: interaction.guild.roles.cache.get(process.env.BETA_ROLE_ID).toString(),
                    }
                ])
                .setColor("Blue")
        ] })
    }
}