const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("wunschbearbeiten")
    .setDescription("Nimm einen Wunsch an oder lehne ihn ab.")
    .addStringOption(option => option.setName('wunsch').setDescription('Wunsch ID').setRequired(true))
    .addBooleanOption(option => option.setName('status').setDescription('True -> Wunsch annehmen, False -> Wunsch ablehnen').setRequired(true))
    ,
    async execute(interaction) {
        if (interaction.member.roles.cache.some(role => role.id === process.env.TEAM_ROLE_ID)) {
            var status;
            var farbe;
            if (interaction.options.getBoolean("status")) {
                status = "Angenommen";
                farbe = "Green";
            } else {
                status = "Abgelehnt";
                farbe = "Red";
            }
            interaction.guild.channels.cache.get(process.env.WUENSCHE_CHANNEL_ID).messages.fetch(interaction.options.getString("wunsch"))
            .then(message => {
                interaction.guild.channels.cache.get(process.env.WUENSCHEBEARBEITEN_CHANNEL_ID).send({ embeds:[
                    new EmbedBuilder()
                        .setTitle(status)
                        .setDescription(message.embeds[0].description)
                        .setFooter({text: `${message.embeds[0].footer.text} bearbeitet von ${interaction.user.username}#${interaction.user.discriminator}`, iconURL:message.embeds[0].footer.iconURL})
                        .setColor(farbe)
                ]});

                message.delete();

                interaction.reply({ content: interaction.guild.channels.cache.get(process.env.WUENSCHEBEARBEITEN_CHANNEL_ID).toString(), ephemeral: true });
            })
            .catch(error => {
                interaction.reply({ content:`Es gab einen Fehler beim Ausführen. Höchstwahrscheinlich hast du eine ungültige MessageID angegeben. 
                Hier der Error, wenns einen gibt:${error}`, ephemeral: true });
                return;
            });
        }
    }
}