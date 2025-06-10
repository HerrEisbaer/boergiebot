const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("farben")
    .setDescription("Siehe alle gültigen Farben"),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle("Farben")
            .setDescription("Hier siehst du alle Farben.")
            .setColor("Blue")

        const alleFarben = require('../../allefarben.json');
        const farben = {
            name: "Farben",
            value: "```"
        };
        alleFarben.forEach(farbe => {
            farben.value += ", " + farbe;
        })
        farben.value += "```";
        farben.value = farben.value.slice(5, farben.value.length - 1);
        embed.addFields(farben);
        
        interaction.reply({ embeds: [embed], ephemeral: true });
    }
}