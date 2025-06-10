const { ContextMenuCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder, ApplicationCommandType } = require("discord.js")

module.exports = {
    data: new ContextMenuCommandBuilder()
    .setName("Get Stats")
    .setType(ApplicationCommandType.User),
    async execute(interaction) {
        const member = interaction.guild.members.cache.find(member => member.id === interaction.targetId)
        
        const stats = await fetch(`http://localhost:42069/database/getStats`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({
                discord: interaction.targetId
            })
        }).then(res => res.json())

        if (!stats) {
            interaction.reply({ embeds: [
                new EmbedBuilder()
                    .setTitle("Fehler")
                    .setDescription("Der angebene User hat keinen Account, oder es ist ein anderer Fehler passiert.")
                    .setColor("Red")
            ], ephemeral: true })
            return;
        }
        const username = (await fetch(`http://localhost:42069/database/getNameFromDiscord/${interaction.targetId}`).then(res => res.json())).name;
        interaction.reply({ embeds: [
            new EmbedBuilder()
                .setTitle(`Stats von ${username} (${member.user.tag})`)
                .setColor("Blue")
                .addFields([
                    {
                        name: "Kills",
                        value: stats.kills.toString(),
                        inline: true
                    },
                    {
                        name: "Deaths",
                        value: stats.deaths.toString(),
                        inline: true
                    },
                    {
                        name: "K/D",
                        value: (stats.kills / stats.deaths).toFixed(2).toString(),
                        inline: true
                    },
                    {
                        name: "Level",
                        value: stats.level.level.toString(),
                        inline: true
                    },
                    {
                        name: "XP",
                        value: stats.level.xp.toString(),
                        inline: true
                    }
                ])
        ]})
    }
}