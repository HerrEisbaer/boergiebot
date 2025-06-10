const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, CommandInteraction } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("sendticketembed")
    .setDescription("mega rp")
    .addChannelOption(option => option.setName('channel').setDescription('channel').setRequired(true)),
    /**
    * @param { CommandInteraction } interaction
    */
    async execute(interaction) {
        if (!interaction.member.id === "448763352299077632") return;
        const channel = interaction.options.getChannel("channel");
        await channel.send({ embeds: [
            new EmbedBuilder()
            .setTitle(`Erstelle ein Supportticket`)
            .setDescription("Um ein Ticket zu erstellen, klicke auf 🎟️")
            .setColor("DarkGreen")
        ], components: [ new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('openticket')
					.setLabel('Ticket eröffnen')
					.setStyle(2)
                    .setEmoji('🎟️'),
            )
        ], ephemeral: true });
        
        await interaction.reply({ embeds: [
            new EmbedBuilder()
            .setTitle(`Erfolg`)
            .setDescription("Das Ticketsystem wurde erfolgreich aufgesetzt.")
            .setColor("Green")
        ], ephemeral: true });
    }
}