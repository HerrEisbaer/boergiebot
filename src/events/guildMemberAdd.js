const { GuildMember, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "guildMemberAdd",
    /**
     * @param {GuildMember} member
     */
    execute(member) {
        if (member.guild.id === process.env.DISCORD_GUILD_ID) {
            let role = member.guild.roles.cache.find(r => r.id === process.env.DISCORD_PLAYER_ROLE);
            member.roles.add(role)
            member.guild.channels.cache.get(process.env.WELCOME_CHANNEL_ID).send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Willkommen")
                        .setDescription(`${member.toString()} ist dem Server beigetreten. Viel Spaß auf unserem Server.`)
                        .setThumbnail(member.user.displayAvatarURL())
                        .setFooter({
                            text: `${member.user.tag} ist der ${member.guild.memberCount}. Member.`
                        })
                        .setColor("Blue")
                ]
            });
        }
    }
}