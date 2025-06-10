const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("levelrechnen")
    .setDescription("rp")
    .addIntegerOption(option => option.setName("level").setDescription("level").setRequired(true)),
    async execute(interaction) {
        const targetlevel = interaction.options.getInteger("level");
        let needexp = 0;
        for (let i = 0; i <= targetlevel; i++) {
            needexp += getNeededXP(i);
        }
        interaction.reply({ embeds: [
            new EmbedBuilder()
                .setTitle("Level zu XP")
                .addFields([
                    {
                        name: `Benötigte XP für Level ${targetlevel}`,
                        value: needexp.toString()
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