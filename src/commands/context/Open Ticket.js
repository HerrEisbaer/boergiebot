const { ContextMenuCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ApplicationCommandType, ContextMenuCommandInteraction, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
    data: new ContextMenuCommandBuilder()
    .setName("Open Ticket")
    .setType(ApplicationCommandType.User),
    /**
     * @param {ContextMenuCommandInteraction} interaction 
     */
    async execute(interaction) {
        if (interaction.member.roles.cache.some(role => role.id === process.env.TEAM_ROLE_ID)) {
            interaction.reply({ embeds: [
                new EmbedBuilder()
                .setTitle("Ticketsystem")
                .setDescription(`Möchtest du wirklich ein Ticket für ${await interaction.guild.members.cache.find(user => user.id === interaction.targetId)} erstellen?`)
                .setColor("Red")
            ], components: [ new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('openticketforuseryes')
                        .setLabel('Ticket öffnen')
                        .setStyle(3)
                        .setEmoji('✅'),
                )
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId("openticketforuserno")
                    .setLabel("Doch nicht")
                    .setStyle(4)
                    .setEmoji("✖️")
                )
            ], ephemeral: true })
        } else {
            await interaction.reply({ embeds: [
                new EmbedBuilder()
                    .setTitle("Fehler")
                    .setDescription("Dafür hast du keine Rechte")
                    .setColor("Red")
            ], ephemeral: true })
        }
    }
}