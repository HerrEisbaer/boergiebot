const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Zeige den Avatar eines Users an.")
    .addUserOption(option => option.setName("member").setDescription("Der Member").setRequired(true)),
    async execute(interaction) {
        const member = interaction.options.getMember("member")
        if (member.user.avatarURL()) {
            interaction.reply({embeds: [
                new EmbedBuilder()
                    .setTitle(`Profilbild von ${member.user.tag}`)
                    .setImage(`${member.user.avatarURL({dynamic:true})}?size=512`)
                    .setURL(`${member.user.avatarURL()}?size=512`)
                    .setColor("Blue")
            ]})
        } else {
            interaction.reply({ embeds: [
                new EmbedBuilder()
                    .setTitle("Fehler")
                    .setDescription(`${member.user.toString()} hat kein Avatar.`)
                    .setColor("Red")
            ]})
        }
    }
}