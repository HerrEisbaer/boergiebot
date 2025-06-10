const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("xprechnen")
    .setDescription("Rechne, zu welchem Level du mit ... XP kommst")
    .addIntegerOption(option => option.setName("xp").setDescription("XP").setRequired(true)),
    async execute(interaction) {
        let level = 0;
        let xp = interaction.options.getInteger("xp");
        while (xp >= getNeededXP(level)) {
            const needed = getNeededXP(level);
            if (xp >= needed) {
                level++;
                xp -= needed;
            }
        };
        interaction.reply({ embeds: [
            new EmbedBuilder()
                .setTitle("XP zu Level")
                .addFields([
                    {
                        name: "Level",
                        value: (level - 1).toString()
                    },
                    {
                        name: "Übrige XP",
                        value: xp.toString()
                    },
                    {
                        name: `XP benötigt für Level ${level}`,
                        value: getNeededXP(level).toString()
                    }
                ])
                .setColor("Green")
        ], components: [
            new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("showhowlevelberechnung")
                        .setLabel('Wie wird das berechnet?')
                        .setStyle(2)
                        .setEmoji('❓'),
                )
        ]});
    }
}

function getNeededXP(level) {
    return (level * level);
}