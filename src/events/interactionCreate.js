const { Interaction, GuildMember, EmbedBuilder, ActionRowBuilder, ButtonBuilder, PermissionsBitField, ChannelType } = require("discord.js");

const Delay = (ms) => new Promise((res) => setTimeout(res, ms));

const closingtickets = {};

const ticketübernahmen = {};

module.exports = {
    name: "interactionCreate",
    /**
     * @param { Interaction } interaction
    */
    async execute(interaction) {
	    if (!interaction.isButton()) return;
        switch (interaction.customId) {
            case "openticket":
                // const ticketchannel = await createNewTicket(interaction, interaction.user.username);
                const allMembergeil = await interaction.guild.members.fetch();
                const wehfoundMember = await allMembergeil.find(user => user.id === interaction.user.id);
                const ticketchannel = await createTicketForUser(interaction, wehfoundMember);
                // await ticketchannel.send(interaction.guild.roles.cache.get(process.env.TEAM_ROLE_ID).toString()).then(message => {
                //     message.delete();
                // })
                ticketchannel.send({
                    embeds: [ new EmbedBuilder()
                        .setTitle("Ticket")
                        .setDescription(`Das Team wurde bereits kontaktiert. Sie werden dir in Kürze helfen :). Tue dem Support einen Gefallen und nutze die Zeit und beschreibe dein Anliegen hier in diesem Channel, damit wir dir helfen können 😄. 
                        \n \n Wenn dein Ticket geschlossen werden kann, klicke unten auf das 🔒`)
                        .setColor("Blue")
                    ],
                    components: [ new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('closeticket')
                                .setLabel('Ticket schließen')
                                .setStyle(4)
                                .setEmoji('🔒'),
                        )
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId("ticketübernehmen")
                            .setLabel("Ticket übernehmen")
                            .setStyle(2)
                            .setEmoji("🎟️")
                        )
                    ]
                });
                interaction.reply({ content: `Ein neues Ticket wurde für dich erstellt, ${ticketchannel.toString()}`, ephemeral: true });
                break;
            case "closeticket":
                interaction.reply({
                    embeds: [ new EmbedBuilder()
                    .setTitle("Ticket")
                    .setDescription("Möchtest du **wirklich** das Ticket schließen? Danach kannst du das Ticket **nicht** mehr öffnen.")
                    .setColor("Red")
                ],
                components: [ new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('closeticketja')
                            .setLabel('Ticket wirklich schließen')
                            .setStyle(3)
                            .setEmoji('✅'),
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('closeticketnein')
                            .setLabel('Ticket doch nicht schließen')
                            .setStyle(4)
                            .setEmoji('✖️')
                    )
                ], ephemeral: true });
                break;
            case "closeticketja":
                if (closingtickets[interaction.channelId]) {
                    await interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Fehler")
                                .setDescription("Jemand anderes versucht schon das Ticket zu schließen.")
                                .setColor("Red")
                    ], ephemeral: true });
                    return;
                }
                closingtickets[interaction.channelId] = true;
                await interaction.reply({ embeds: [
                    new EmbedBuilder()
                    .setTitle("Ticket geschlossen")
                    .setDescription(`Dieses Ticket wurde von ${interaction.member.toString()} geschlossen. Nun wird das Ticket in 10 Sekunden gelöscht.`)
                    .setColor("DarkRed")
                ]});
                const altename = interaction.channel.name;
                await interaction.channel.setName(`closed_${interaction.channel.name}`);
                await Delay(5000);
                const channel = await interaction.guild.channels.cache.get(process.env.TICKET_LOGCHANNEL_ID);
                channel.send({ embeds: [
                    new EmbedBuilder()
                    .setTitle("Ticket Log System")
                    .setDescription(`Das Ticket "${altename}" wurde von ${interaction.member.toString()} gelöscht.`)
                    .setColor("DarkRed")
                ]})
                delete closingtickets[interaction.channel.id];
                await interaction.channel.delete();
                break;
            case "closeticketnein":
                await interaction.reply({ embeds: [
                    new EmbedBuilder()
                    .setTitle("Ticket")
                    .setDescription("Das Ticket wird nicht geschlossen.")
                    .setColor("DarkGreen")
                ], ephemeral: true })
                break;
            case "ticketübernehmen":
                if (interaction.channel.parentId !== process.env.TICKET_CAT_ID) {
                    interaction.reply({ embeds:[
                        new EmbedBuilder()
                            .setTitle("Fehler")
                            .setDescription("Du kannst nur in einem Ticket ein Ticket übernehmen")
                            .setColor("Red")
                    ], ephemeral: true });
                    return;
                }
                if (!(interaction.member.roles.cache.some(role => role.id === process.env.TEAM_ROLE_ID))) {
                    interaction.reply({ embeds:[
                        new EmbedBuilder()
                        .setTitle("Fehler")
                        .setDescription("Du kannst als nicht Teamler keine Tickets übernehmen.")
                        .setColor("Red")
                    ], ephemeral: true });
                    return;
                }
                if (ticketübernahmen[interaction.message.channelId]) {
                    interaction.reply({embeds:[
                        new EmbedBuilder()
                        .setTitle("Fehler")
                        .setDescription("Du kannst dieses Ticket nicht übernehmen, da ein anderer es bereits übernommen hat.")
                        .setColor("Red")
                    ], ephemeral:true });
                    return;
                }
                await interaction.reply({ embeds:[
                    new EmbedBuilder()
                    .setTitle("Tickets")
                    .setDescription("Unten bei den Knöpfen kannst du das Ticket freilassen, damit ein anderer als Helfer angezeigt wird. Klicke die Knöpfe nur, wenn du dir sicher bist, dass du nicht weiterhelfen kannst.")
                    .setColor("Red")
                ], components:[
                    new ActionRowBuilder()
                    .setComponents(
                        new ButtonBuilder()
                        .setCustomId("ticketfreigeben")
                        .setLabel("Gebe das Ticket frei.")
                        .setStyle(4)
                        .setEmoji("🗿")
                    )
                ], ephemeral: true })

                await interaction.channel.send({ embeds: [
                    new EmbedBuilder()
                    .setTitle("Tickets")
                    .setDescription(`${interaction.user.toString()} hat nun dein Ticket übernommen und hilft dir in deinem Fall.`)
                    .setColor("Green")
                ]});
                ticketübernahmen[interaction.channelId] = interaction.member.toString();
                break;
            case "ticketfreigeben":
                if (interaction.message.channel.parent != process.env.TICKET_CAT_ID) {
                    await interaction.reply({embeds:[
                        new EmbedBuilder()
                        .setTitle("Fehler")
                        .setDescription("Du kannst nur in einem Ticket ein Ticket freigeben")
                        .setColor("Red")
                    ], ephemeral: true });
                    return;
                }
                if (!(interaction.member.roles.cache.some(role => role.id === process.env.TEAM_ROLE_ID))) {
                    interaction.reply({embeds:[
                        new EmbedBuilder()
                        .setTitle("Fehler")
                        .setDescription("Du kannst als nicht Teamler keine Tickets übernehmen.")
                        .setColor("Red")
                    ], ephemeral: true })
                    return
                }
                if (!ticketübernahmen[interaction.message.channelId]) {
                    await interaction.reply({embeds:[
                        new EmbedBuilder()
                        .setTitle("Fehler")
                        .setDescription("Du kannst dieses Ticket nicht übernehmen, da es noch niemand übernommen hat.")
                        .setColor("Red")
                    ], ephemeral: true });
                    return;
                }
                await interaction.channel.send({ embeds: [
                    new EmbedBuilder()
                    .setTitle("Tickets")
                    .setDescription(`${interaction.member.toString()} hat das Ticket freigegeben.`)
                    .setColor("Blue")
                ]});
                delete ticketübernahmen[interaction.message.channelId];
                await interaction.reply({embeds:[
                    new EmbedBuilder()
                    .setTitle("Tickets")
                    .setDescription("Das Ticket wurde erfolgreich freigegeben.")
                    .setColor("Green")
                ], ephemeral: true });
                break;
            case "openticketforuseryes":
                const notresolvedid = interaction.message.embeds[0].description.replace("Möchtest du wirklich ein Ticket für <@", "").replace("> erstellen?", "");
                const allMember = await interaction.guild.members.fetch();
                const foundMember = await allMember.find(user => user.id === notresolvedid);
                const newticketchannel = await createTicketForUser(interaction, foundMember);
                await newticketchannel.send(foundMember.toString()).then(message => {
                    message.delete();
                })
                await newticketchannel.send({
                    embeds: [ new EmbedBuilder()
                        .setTitle("Ticket")
                        .setDescription(`Das Team wurde bereits kontaktiert. Sie werden dir in Kürze helfen :). Tue dem Support einen Gefallen und nutze die Zeit und beschreibe dein Anliegen hier in diesem Channel, damit wir dir helfen können 😄. 
                        \n \n Wenn dein Ticket geschlossen werden kann, klicke unten auf das 🔒`)
                        .setColor("Blue")
                    ],
                    components: [ new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('closeticket')
                                .setLabel('Ticket schließen')
                                .setStyle(4)
                                .setEmoji('🔒'),
                        )
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId("ticketübernehmen")
                            .setLabel("Ticket übernehmen")
                            .setStyle(2)
                            .setEmoji("🎟️")
                        )
                    ]
                });
                interaction.reply({ content: `Ein neues Ticket wurde für dich erstellt, ${newticketchannel.toString()}`, ephemeral: true });
                break;
        }
    }
}

/**
 * @param { Interaction } interaction
 * @param { GuildMember } adduser
*/
async function createNewTicket(interaction) {
    const ticketname = `ticket_${interaction.user.username}_${Math.floor(Math.random() * 100001)}`;
    return await interaction.guild.channels.create({
        name: ticketname,
        type: ChannelType.GuildText,
        permissionOverwrites: [
            {
                id: interaction.guild.roles.everyone,
                deny: [ PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory ]
            },
            {
                id: process.env.TEAM_ROLE_ID,
                allow: [ PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory ]
            }
        ],
        parent: process.env.TICKET_CAT_ID
    });
}

/**
 * @param { Interaction } interaction
 * @param { GuildMember } adduser
*/

async function createTicketForUser(interaction, adduser) {
    const ticketname = `ticket_${adduser.user.username}_${Math.floor(Math.random() * 100001)}`;
    return await interaction.guild.channels.create({
        name: ticketname,
        type: ChannelType.GuildText,
        permissionOverwrites: [
            {
                id: interaction.guild.roles.everyone,
                deny: [ PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory ]
            },
            {
                id: process.env.TEAM_ROLE_ID,
                allow: [ PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory ]
            },
            {
                id: adduser.id,
                allow: [ PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.SendMessages ]
            }
        ],
        parent: process.env.TICKET_CAT_ID
    });
}