require("dotenv").config();
const fs = require('fs');

const { Client, Collection, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalSubmitInteraction, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");

const Delay = (ms) => new Promise((res) => setTimeout(res, ms));

const client = new Client({intents: [
    'Guilds',
    'GuildMessages',
    'MessageContent',
    'GuildMembers'
    ],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

//Slash Commands

client.commands = new Collection();

const commandFiles = fs.readdirSync("./src/commands").filter(file => file.endsWith(".js"));

commandFiles.forEach(commandFile => {
    const command = require(`./commands/${commandFile}`);
    client.commands.set(command.data.name, command);
});

//Context Menu
const contextFiles = fs.readdirSync("./src/commands/context").filter(file => file.endsWith(".js"));

contextFiles.forEach(contextFile => {
    const command = require(`./commands/context/${contextFile}`);
    client.commands.set(command.data.name, command);
});

client.on("interactionCreate", async (interaction) => {
    if(!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (command) {
        try {
            await command.execute(interaction);
        } catch(error) {
            console.error(error);

            if (interaction.deferred || interaction.replied) {
                interaction.editReply("Es ist ein Fehler beim ausführen aufgetreten.");
            } else {
                interaction.reply("Es ist ein Fehler beim ausführen aufgetreten.");
            }
        }
    }
})

//Events

const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));

eventFiles.forEach(eventFile => {
    const event = require(`./events/${eventFile}`);
    client.on(event.name, (...args) => event.execute(...args));
});

//Andere halt

client.once('ready', async () => {
    const ibgwguild = await client.guilds.cache.find(guild => guild.id === process.env.DISCORD_GUILD_ID);
    console.log(`Ready! Logged in as ${client.user.tag}. I'm on ${client.guilds.cache.size} guilds.`);
    client.user.setActivity({
        name: `${ibgwguild.memberCount} Membern zu`, 
        type: 3
    });
    // ibgwguild.rulesChannel
});

//Wünsche

client.on('messageCreate', message => {
    if (message.author.bot) return;
    if (message.channelId === process.env.WUENSCHE_CHANNEL_ID) {
        message.delete().then(() => {
            const embed = new EmbedBuilder()
                .setTitle("Wunsch")
                .setDescription(`${message.content}`)
                .setFooter({text: `Wunsch von ${message.author.username + "#" + message.author.discriminator}`, iconURL: message.author.avatarURL()})
                .setColor("Green");
            if (!(message.attachments.first() == undefined || null)) {
                embed.setImage(message.attachments.first().url);
            }
            message.guild.channels.cache.get(process.env.WUENSCHE_CHANNEL_ID).send({
                embeds: [embed]
            }).then(embedMessage => {
                embedMessage.react("👍");
                embedMessage.react("👎");
            });
        });
    }
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isButton()) return;
    switch(interaction.customId) {
        case "acceptrules":
            if (interaction.member.roles.cache.find(role => role.id === process.env.DISCORD_PLAYER_ROLE)) {
                interaction.reply({ embeds: [
                    new EmbedBuilder()
                        .setTitle("Fehler")
                        .setDescription("Du hast die Rolle bereits.")
                        .setColor("Red")
                ], ephemeral: true});
                return;
            }
            const role = interaction.guild.roles.cache.find(r => r.id === process.env.DISCORD_PLAYER_ROLE);
            interaction.member.roles.add(role);
            interaction.reply({ embeds: [
                new EmbedBuilder()
                    .setTitle("Verifiziert")
                    .setDescription(`Du hast die Regeln Regeln akzeptiert und dir wurde die ${role.toString()} gegeben.`)
                    .setColor("Green")
            ], ephemeral: true});
            break;
        case "showhowlevelberechnung":
            interaction.reply({ embeds: [
                new EmbedBuilder()
                    .setTitle("Levelberechnung")
                    .setDescription("Um XP zu Level zu berechnen, wird ein einfacher Algorithmus verwendet.")
                    .addFields([
                        {
                            name: "Code",
                            value: 
                            "```while (xp >= (level * level) {\n" +
                            "   const needed = (level * level);\n" +
                            "   if (xp >= needed) {\n" +
                            "       level++;\n" +
                            "       xp -= needed;\n" +
                            "   }\n" +
                            "};```"
                        }
                    ])
                    .setColor("DarkGold")
            ], ephemeral: true });
            break;
        case "newssendyes":
            if(getPermissionLevel(interaction.member) <= 3) {
                interaction.reply({embeds:[
                    new EmbedBuilder()
                        .setTitle("Fehler")
                        .setDescription("Deine Rechte sind nicht ausreichend.")
                        .setColor("Red")
                ], ephemeral: true})
                return;
            }
            const newschannel = interaction.guild.channels.cache.get(process.env.NEWS_CHANNEL_ID);
            await newschannel.send({
                embeds: interaction.message.embeds
            })
            interaction.reply({embeds: [
                new EmbedBuilder()
                    .setTitle("News")
                    .setDescription(`News gepostet: ${newschannel.toString()}`)
                    .setColor("Green")
            ], ephemeral: true})
            break;
    }
});

function getPermissionLevel(user) {
    let rechte = 0;
    if (user.roles.cache.some(role => role.id === "1089931261994352856")) rechte = 5;
    if (user.roles.cache.some(role => role.id === "1089931427241541712") && rechte === 0) rechte = 4;
    if (user.roles.cache.some(role => role.id === "1089931429439348857") && rechte === 0) rechte = 3;
    if (user.roles.cache.some(role => role.id === "1089931431205163090") && rechte === 0) rechte = 2;
    if (user.roles.cache.some(role => role.id === "1089931433667211324") && rechte === 0) rechte = 1;
    return rechte;
}

function isValidHttpUrl(string) {
    let url;
    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
}

//Modals

const roles = ["1090335967736508536", "1100074122148581470", "1089931433667211324", "1089931431205163090", "1089931429439348857", "1089931427241541712", "1089931261994352856"];
const groups = ["User", "Beta", "VIP", "Supporter", "Moderator", "Administrator", "Owner"];
const farbenobj = require('../allefarben.json');

/**
 * @param { ModalSubmitInteraction } interaction
 */
client.on('interactionCreate', async interaction => {
    if (!interaction.isModalSubmit()) return;
	switch (interaction.customId) {
        case "newsmodal":
            const title = interaction.fields.getTextInputValue("newstitleinput");
            const content = interaction.fields.getTextInputValue("newstextinput");
            const footer = interaction.fields.getTextInputValue("newsfooterinput");
            const footerurl = interaction.fields.getTextInputValue("newsfooterurlinput");
            const color = interaction.fields.getTextInputValue("newscolorinput");
            
            const footerweh = {
                text: footer,
                iconURL: footerurl
            }

            if (!isValidHttpUrl(footerurl)) {
                interaction.reply({ embeds: [
                    new EmbedBuilder()
                        .setTitle("Fehler")
                        .setDescription("Die URL ist ungültig")
                        .setColor("Red")
                ], ephemeral: true });
                return;
            } else {
                footerweh.iconURL = footerurl;
            }

            const embed = new EmbedBuilder()
                .setTitle(title)
                .setDescription(content)
                .setFooter(footerweh)
            
            const farbe = farbenobj.find(farbe => farbe.toLowerCase() === color.toLowerCase());
            if (farbe) { embed.setColor(farbe) } else {
                interaction.reply({ embeds: [
                    new EmbedBuilder()
                        .setTitle("Fehler")
                        .setDescription("Die Farbe ist ungültig.")
                        .setColor("Red")
                ], ephemeral: true })
                return;
            };

            await interaction.reply({ embeds: [embed], components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("newssendyes")
                            .setLabel('News senden')
                            .setStyle(3)
                            .setEmoji('📰')
                    )
            ], ephemeral: true });
            break;
        case "forcerankmodal":
            const rechte = getPermissionLevel(interaction.member);
            const userinfo = interaction.fields.getTextInputValue("userinput");
            const user = interaction.guild.members.cache.find(user => user.user.tag === userinfo);

            const rang = interaction.fields.getTextInputValue("rankinput");
            if (!(rang <= rechte) || rechte <= 4) {
                interaction.reply({embeds: [
                    new EmbedBuilder()
                        .setTitle("Fehler")
                        .setDescription("Deine Rechte sind nicht ausreichend.")
                        .setColor("Red")
                ], ephemeral: true});
                return;
            }
            
            let userRechte = getPermissionLevel(user);
            if (rechte < userRechte) {
                interaction.reply({embeds: [
                    new EmbedBuilder()
                        .setTitle("Fehler")
                        .setDescription("Du kannst keinem Höherrangigen den Rang setzen.")
                        .setColor("Red")
                ], ephemeral: true});
                return;
            }
    
            const result = await fetch(`http://localhost:42069/database/getIdsFromDiscord/${user.id}`).then(res => res.json());
            if (!result || result.ids?.fivem == null || result.ids?.steam == null || result.ids?.discord == null) {
                interaction.reply({embeds: [
                    new EmbedBuilder()
                        .setTitle("Fehler")
                        .setDescription("Die Identifier sind ungültig oder er besitzt keinen Account.")
                        .setColor("Red")
                ], ephemeral: true});
                return;
            }

            const role = roles[interaction.fields.getTextInputValue("rankinput")];

            for (lolrole of roles) {
                await user.roles.remove(interaction.guild.roles.cache.get(lolrole));
            }
            await user.roles.add(role);
            await user.roles.add(roles[0]);
            fetch('http://localhost:42069/database/setRank/', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({
                    rank: groups[rechte].toLowerCase(),
                    discordid: user.id
                })
            });
            await interaction.reply({embeds: [
                new EmbedBuilder()
                    .setTitle("Rang Update")
                    .setDescription(`Du hast erfolgreich ${user.toString()} den Rang ${interaction.guild.roles.cache.get(role).toString()} geforced.`)
                    .setColor("Green")
            ], ephemeral: true});
            break;
    }
})

client.login(process.env.DISCORD_BOT_TOKEN);