const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("news")
    .setDescription("News senden (rp)"),
    async execute(interaction) {

        if(getPermissionLevel(interaction.member) <= 3) {
            interaction.reply({embeds:[
                new EmbedBuilder()
                    .setTitle("Fehler")
                    .setDescription("Deine Rechte sind nicht ausreichend.")
                    .setColor("Red")
            ], ephemeral: true})
            return;
        }
        
        const modal = new ModalBuilder()
            .setCustomId("newsmodal")
            .setTitle("News erstellen");

        const title = new TextInputBuilder()
            .setCustomId("newstitleinput")
            .setLabel("Titel")
            .setStyle(TextInputStyle.Short);

        const newstext = new TextInputBuilder()
            .setCustomId("newstextinput")
            .setLabel("News")
            .setStyle(TextInputStyle.Paragraph);

        const footer = new TextInputBuilder()
            .setCustomId("newsfooterinput")
            .setLabel("Footer")
            .setStyle(TextInputStyle.Short)
            .setValue(`News gesendet von ${interaction.user.tag}`)
            .setMaxLength(2048);

        const color = new TextInputBuilder()
            .setCustomId("newscolorinput")
            .setLabel("Gültige Farbe")
            .setStyle(TextInputStyle.Short)
            .setMaxLength(20)
            .setValue("Default")
            .setRequired(false);
        
        const footerURL = new TextInputBuilder()
            .setCustomId("newsfooterurlinput")
            .setLabel("Footer IMG Url")
            .setStyle(TextInputStyle.Short)
            .setMaxLength(100)
            .setValue(`${interaction.user.avatarURL({dynamic:true})}?size=512`)
            .setRequired(false);
        
        const firstRow = new ActionRowBuilder().addComponents(title);
        const secondRow = new ActionRowBuilder().addComponents(newstext);
        const thirdRow = new ActionRowBuilder().addComponents(footer);
        const fourthrow = new ActionRowBuilder().addComponents(color);
        const fifthrow = new ActionRowBuilder().addComponents(footerURL);

        modal.addComponents(firstRow, secondRow, thirdRow, fourthrow, fifthrow);

        await interaction.showModal(modal)
    }
}

function getPermissionLevel(user) {
    let rechte = 0;
    if (user.roles.cache.some(role => role.id === "1089931261994352856")) rechte = 5;
    if (user.roles.cache.some(role => role.id === "1089931427241541712") && rechte === 0) rechte = 4;
    if (user.roles.cache.some(role => role.id === "1089931429439348857") && rechte === 0) rechte = 3;
    if (user.roles.cache.some(role => role.id === "1089931431205163090") && rechte === 0) rechte = 2;
    if (user.roles.cache.some(role => role.id === "1089931433667211324") && rechte === 0) rechte = 1;
    return rechte;
}