const { ContextMenuCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder, ApplicationCommandType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js")

const roles = ["1090335967736508536", "1100074122148581470", "1089931433667211324", "1089931431205163090", "1089931429439348857", "1089931427241541712", "1089931261994352856"];
const groups = ["User", "Beta", "VIP", "Supporter", "Moderator", "Administrator", "Owner"];

module.exports = {
    data: new ContextMenuCommandBuilder()
    .setName("Force Rank")
    .setType(ApplicationCommandType.User),
    async execute(interaction) {
        const member = interaction.guild.members.cache.find(member => member.id === interaction.targetId);
        
        if (interaction.member.id != "448763352299077632") return;

        if(getPermissionLevel(interaction.member) <= 5) {
            interaction.reply({embeds:[
                new EmbedBuilder()
                    .setTitle("Fehler")
                    .setDescription("Deine Rechte sind nicht ausreichend.")
                    .setColor("Red")
            ], ephemeral: true})
            return;
        }

        const modal = new ModalBuilder()
        .setCustomId("forcerankmodal")
        .setTitle("Force Rank");

        const rank = new TextInputBuilder()
        .setCustomId("rankinput")
        .setLabel("Ranglevel")
        .setMaxLength(1)
        .setStyle(TextInputStyle.Short);

        const user = new TextInputBuilder()
            .setCustomId("userinput")
            .setLabel("User")
            .setValue(member.user.tag)
            .setStyle(TextInputStyle.Short);

        const firstRow = new ActionRowBuilder().addComponents(rank);
        const secondRow = new ActionRowBuilder().addComponents(user);

        modal.addComponents(firstRow, secondRow);

        await interaction.showModal(modal)
    }
}

function getPermissionLevel(user) {
    let rechte = 0;
    if (user.roles.cache.some(role => role.id === "1089931261994352856")) rechte = 6;
    if (user.roles.cache.some(role => role.id === "1089931427241541712") && rechte === 0) rechte = 5;
    if (user.roles.cache.some(role => role.id === "1089931429439348857") && rechte === 0) rechte = 4;
    if (user.roles.cache.some(role => role.id === "1089931431205163090") && rechte === 0) rechte = 3;
    if (user.roles.cache.some(role => role.id === "1089931433667211324") && rechte === 0) rechte = 2;
    if (user.roles.cache.some(role => role.id === "1100074122148581470") && rechte === 0) rechte = 1;
    return rechte;
}