const { ContextMenuCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder, ApplicationCommandType } = require("discord.js")

module.exports = {
    data: new ContextMenuCommandBuilder()
    .setName("Show Avatar")
    .setType(ApplicationCommandType.User),
    async execute(interaction) {
        const member = interaction.guild.members.cache.find(member => member.id === interaction.targetId)
        if (member.user.avatarURL()) {
            interaction.reply({embeds: [
                new EmbedBuilder()
                    .setTitle(`Profilbild von ${member.user.tag}`)
                    .setImage(`${member.user.avatarURL({dynamic:true})}?size=512`)
                    .setURL(`${member.user.avatarURL()}?size=512`)
                    .setColor("Blue")
            ], ephemeral: true})
        } else {
            interaction.reply({ embeds: [
                new EmbedBuilder()
                    .setTitle("Fehler")
                    .setDescription(`${member.user.toString()} hat kein Avatar.`)
                    .setColor("Red")
            ], ephemeral: true })
        }
    }
}