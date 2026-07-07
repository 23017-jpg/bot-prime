// ========================================================
// 1. SERVIDOR WEB PARA O RENDER E UPTIME ROBOT
// ========================================================
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('💜 Sistema Prime está online!');
});

app.listen(PORT, () => {
    console.log(`🌐 Servidor Web ativo na porta ${PORT}`);
});

// ========================================================
// 2. SISTEMA DO BOT DO DISCORD (DISCORD.JS)
// ========================================================
const { 
    Client, 
    GatewayIntentBits, 
    PermissionsBitField, 
    ButtonBuilder, 
    ButtonStyle, 
    ActionRowBuilder, 
    EmbedBuilder, 
    StringSelectMenuBuilder, 
    StringSelectMenuOptionBuilder, 
    REST, 
    Routes, 
    SlashCommandBuilder, 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle,
    MessageFlags 
} = require('discord.js');

// --- CONFIGURAÇÕES PRINCIPAIS ---
const TOKEN = process.env.TOKEN || 'MTUyNDEyMTEwOTI5NTkyMzI3MA.GvKUbn.t8OJpu_81tV73jYVkYGe__8NTcGK-fP4ZKtYsA'; 
const CLIENT_ID = '1524121109295923270'; 
const STAFF_ROLE_ID = '1523402615592058899'; 

// --- CONFIGURAÇÕES DE CANAIS E CARGOS ---
const VERIFIED_ROLE_ID = '1523402615273165013'; 
const CANAL_SUGESTOES_ID = '1523402617609257204'; 

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

client.once('clientReady', async () => {
    console.log(`🎫 Sistema Prime Ativo com Sucesso!`);

    const commands = [
        new SlashCommandBuilder().setName('tickets').setDescription('Envia o painel de suporte e candidaturas do Prime.'),
        new SlashCommandBuilder().setName('verificacao').setDescription('Envia a mensagem de verificação do servidor.'),
        new SlashCommandBuilder().setName('painelsugestao').setDescription('Envia o painel fixo do Centro de Sugestões.'),
        new SlashCommandBuilder().setName('sugestao').setDescription('Envia uma sugestão diretamente para análise.')
    ];

    const rest = new REST({ version: '10' }).setToken(TOKEN);
    try {
        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
        console.log('Slash Commands registados com sucesso!');
    } catch (error) { console.error(error); }
});

client.on('interactionCreate', async interaction => {
    
    // ==========================================
    // COMANDO /VERIFICACAO
    // ==========================================
    if (interaction.isChatInputCommand() && interaction.commandName === 'verificacao') {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: '❌ Apenas administradores podem usar este comando.', flags: [MessageFlags.Ephemeral] });
        }
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const embed = new EmbedBuilder()
            .setTitle('🛡️ VERIFICAÇÃO | Prime City RP')
            .setDescription(
                '**Bem-vindo ao Prime City RP!**\n\n' +
                'Entraste numa comunidade criada para proporcionar uma experiência de roleplay séria, divertida e envolvendo. Aqui, cada decisão conta e cada história pode marcar o teu percurso dentro da cidade.\n\n' +
                '📌 **Antes de começares**\n' +
                'Recomendamos a leitura de todos os canais informativos, especialmente os relacionados com regras, anúncios e informações do servidor.\n\n' +
                '✨ **Cria a tua história**\n' +
                'Escolhe o teu caminho, desenvolve a tua personagem e faz parte de uma cidade onde as oportunidades são ilimitadas.\n\n' +
                '🤝 **Respeito acima de tudo**\n' +
                'Valorizamos uma comunidade saudável e acolhedora. Mantém sempre o respeito pelos restantes membros.\n\n' +
                '📢 **Mantém-te atualizado**\n' +
                'Fica atento aos anúncios, eventos e novidades para não perderes nenhuma atualização importante.\n\n' +
                '➔ Para desbloqueares o acesso completo ao Discord, clica no botão abaixo e conclui a tua verificação.\n\n' +
                '*Desejamos-te uma excelente estadia e muitas histórias inesquecíveis no Prime City RP!*\n\n' +
                '💜 **Prime City RP - Gestão de Segurança**'
            )
            .setColor('#8a2be2');

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('botao_verificar')
                .setLabel('Concluir Verificação')
                .setStyle(ButtonStyle.Secondary) 
                .setEmoji('💜')
        );

        await interaction.channel.send({ embeds: [embed], components: [row] });
        return interaction.editReply({ content: '✅ Painel de verificação enviado com sucesso!' });
    }

    if (interaction.isButton() && interaction.customId === 'botao_verificar') {
        const role = interaction.guild.roles.cache.get(VERIFIED_ROLE_ID);
        if (!role) return interaction.reply({ content: '❌ Erro: O cargo de Cidadão não foi encontrado.', flags: [MessageFlags.Ephemeral] });

        if (interaction.member.roles.cache.has(VERIFIED_ROLE_ID)) {
            return interaction.reply({ content: '⚠️ Já estás verificado como Cidadão!', flags: [MessageFlags.Ephemeral] });
        }

        try {
            await interaction.member.roles.add(role);
            return interaction.reply({ content: '✅ Foste verificado com sucesso! Cargo de **Cidadão** atribuído.', flags: [MessageFlags.Ephemeral] });
        } catch (e) {
            return interaction.reply({ content: '❌ Erro ao dar o cargo. Verifica a hierarquia dos cargos.', flags: [MessageFlags.Ephemeral] });
        }
    }

    // ==========================================
    // COMANDO /TICKETS
    // ==========================================
    if (interaction.isChatInputCommand() && interaction.commandName === 'tickets') {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: '❌ Apenas administradores podem usar este comando.', flags: [MessageFlags.Ephemeral] });
        }
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const embed = new EmbedBuilder()
            .setTitle('💜 Prime | Sistema de Tickets') 
            .setDescription(
                'Bem-vindo ao sistema de tickets do Prime! Aqui podes abrir um ticket para diferentes situações. Escolhe a categoria correta para garantirmos uma resposta mais rápida e eficiente.\n\n' +
                '⚠️ **Nota:**\n\n' +
                '🟡 Usa o sistema de tickets apenas quando necessário;\n' +
                '🟡 Fornece o máximo de informações possíveis para agilizar o atendimento;\n' +
                '🟡 Evita mencionar a Staff sem necessidade.\n\n' +
                'Para abrires um ticket, basta selecionares a categoria que pretendes!'
            )
            .setColor('#8a2be2');

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('ticket_select_menu')
            .setPlaceholder('Seleciona a categoria do ticket')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Candidatura Staff')
                    .setValue('1523402616204165171')
                    .setDescription('🎯 Categoria para pedidos específicos desta área.')
                    .setEmoji('👑'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Assuntos Gerais')
                    .setValue('1523402616204165177')
                    .setDescription('🎯 Categoria para pedidos específicos desta área.')
                    .setEmoji('🌐'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Reportar Jogador')
                    .setValue('1523402616204165176')
                    .setDescription('🎯 Categoria para pedidos específicos desta área.')
                    .setEmoji('🛑'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Vips e Doações')
                    .setValue('1523402616204165170')
                    .setDescription('🎯 Categoria para pedidos específicos desta área.')
                    .setEmoji('💎'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Streamer')
                    .setValue('1523402616204165178')
                    .setDescription('🎯 Categoria para pedidos específicos desta área.')
                    .setEmoji('🎥'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Ban Appeals')
                    .setValue('1523402616204165174')
                    .setDescription('🎯 Categoria para pedidos específicos desta área.')
                    .setEmoji('🚫'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Organizações')
                    .setValue('1523402616204165172')
                    .setDescription('🎯 Categoria para pedidos específicos desta área.')
                    .setEmoji('💀'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Bugs')
                    .setValue('1523402616204165173')
                    .setDescription('🎯 Categoria para pedidos específicos desta área.')
                    .setEmoji('🐛')
            );

        await interaction.channel.send({ embeds: [embed], components: [new ActionRowBuilder().addComponents(selectMenu)] });
        return interaction.editReply({ content: '✅ Painel enviado com sucesso!' });
    }

    if (interaction.isStringSelectMenu() && interaction.customId === 'ticket_select_menu') {
        const categoryId = interaction.values[0];
        const option = interaction.component.options.find(opt => opt.value === categoryId);
        const ticketTypeName = option ? option.label : 'Suporte';
        
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        try {
            const ticketChannel = await interaction.guild.channels.create({
                name: `${ticketTypeName.toLowerCase().replace(/[^a-z0-9]/g, '')}-${interaction.user.username}`,
                type: 0,
                parent: categoryId,
                permissionOverwrites: [
                    { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                    { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.ReadMessageHistory] },
                    { id: STAFF_ROLE_ID, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.ReadMessageHistory] }
                ],
            });

            const welcomeText = `<@&${STAFF_ROLE_ID}>\n\n👋 Olá **${interaction.user}**! Recebemos o teu pedido na categoria **${ticketTypeName}**.\n\n📝 Envia todos os detalhes (prints, id, o que aconteceu) para ajudarmos da melhor forma.\n⏰ A nossa equipa responde assim que possível.\n\n💜 Obrigado!`; 

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('assumir_ticket').setLabel('Assumir').setStyle(ButtonStyle.Success).setEmoji('👋'),
                new ButtonBuilder().setCustomId('pre_fechar_ticket').setLabel('Fechar').setStyle(ButtonStyle.Danger).setEmoji('🔒'),
                new ButtonBuilder().setCustomId('painel_staff_options').setLabel('Painel Staff').setStyle(ButtonStyle.Primary).setEmoji('⚙️')
            );

            await ticketChannel.setTopic(interaction.user.id);
            await ticketChannel.send({ content: welcomeText, components: [row] });
            
            return interaction.editReply({ content: `✅ Ticket de **${ticketTypeName}** criado com sucesso em: ${ticketChannel}` });

        } catch (error) { 
            console.error(error);
            return interaction.editReply({ content: '❌ Erro ao criar a sala do ticket.' }); 
        }
    }

    // ==========================================
    // PAINEL DE SUGESTÕES
    // ==========================================
    if (interaction.isChatInputCommand() && interaction.commandName === 'painelsugestao') {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: '❌ Apenas administradores podem usar este comando.', flags: [MessageFlags.Ephemeral] });
        }
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const embed = new EmbedBuilder()
            .setTitle('📋 Centro de Sugestões') 
            .setDescription(`Deixe sua sugestão usando o comando </sugestao:${CLIENT_ID}>`) 
            .setColor('#8a2be2');

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('fazer_sugestao_botao')
                .setLabel('Enviar Sugestão')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('💡') 
        );

        await interaction.channel.send({ embeds: [embed], components: [row] });
        return interaction.editReply({ content: '✅ Painel do Centro de Sugestões enviado com sucesso!' });
    }

    if ((interaction.isButton() && interaction.customId === 'fazer_sugestao_botao') || (interaction.isChatInputCommand() && interaction.commandName === 'sugestao')) {
        const modal = new ModalBuilder()
            .setCustomId('modal_sugestao_envio')
            .setTitle('Nova Sugestão');

        const inputSugestao = new TextInputBuilder()
            .setCustomId('texto_sugestao')
            .setLabel('O que deseja sugerir ou alterar?')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setPlaceholder('Escreve aqui detalhadamente a tua sugestão...');

        modal.addComponents(new ActionRowBuilder().addComponents(inputSugestao));
        return interaction.showModal(modal);
    }

    if (interaction.isModalSubmit() && interaction.customId === 'modal_sugestao_envio') {
        const sugestaoTexto = interaction.fields.getTextInputValue('texto_sugestao');
        const canalSugestoes = interaction.guild.channels.cache.get(CANAL_SUGESTOES_ID);

        if (!canalSugestoes) {
            return interaction.reply({ content: '❌ O canal de sugestões não foi encontrado. Verifica o ID configurado.', flags: [MessageFlags.Ephemeral] });
        }

        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const dataAtual = new Date();
        const meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
        const dataFormatada = `${dataAtual.getDate()} de ${meses[dataAtual.getMonth()]} de ${dataAtual.getFullYear()} às ${dataAtual.getHours().toString().padStart(2, '0')}:${dataAtual.getMinutes().toString().padStart(2, '0')}`; 

        const embedSugestao = new EmbedBuilder()
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) }) 
            .setTitle('💡 Nova Sugestão') 
            .setDescription(`\`\`\`\n${sugestaoTexto}\n\`\`\``)
            .addFields(
                { name: '👤 Enviado por:', value: `${interaction.user}`, inline: true }, 
                { name: '🕒 Data/Hora:', value: dataFormatada, inline: true } 
            )
            .setColor('#8a2be2')
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }));

        try {
            const mensagemEnviada = await canalSugestoes.send({ embeds: [embedSugestao] });
            await mensagemEnviada.react('👍'); 
            await mensagemEnviada.react('👎'); 

            return interaction.editReply({ content: `✅ A tua sugestão foi enviada com sucesso para ${canalSugestoes}!` });
        } catch (error) {
            console.error(error);
            return interaction.editReply({ content: '❌ Erro ao publicar a sugestão no canal público.' });
        }
    }

    // ==========================================
    // SISTEMA INTERNO DOS TICKETS
    // ==========================================
    if (interaction.isButton() && interaction.customId === 'assumir_ticket') {
        if (!interaction.member.roles.cache.has(STAFF_ROLE_ID)) return interaction.reply({ content: '❌ Apenas a Staff pode assumir este ticket.', flags: [MessageFlags.Ephemeral] });
        return interaction.reply({ content: `👋 O ticket foi assumido por ${interaction.user}.` });
    }

    if (interaction.isButton() && interaction.customId === 'painel_staff_options') {
        if (!interaction.member.roles.cache.has(STAFF_ROLE_ID)) return interaction.reply({ content: '❌ Apenas a Staff pode aceder a este painel.', flags: [MessageFlags.Ephemeral] });

        const staffMenu = new StringSelectMenuBuilder()
            .setCustomId('staff_tools_menu')
            .setPlaceholder('Selecione uma ação de gestão...')
            .addOptions(
                new StringSelectMenuOptionBuilder().setLabel('Renomear Ticket').setValue('staff_rename').setEmoji('✏️'),
                new StringSelectMenuOptionBuilder().setLabel('Ping Player').setValue('staff_ping_user').setEmoji('🔔')
            );

        return interaction.reply({ content: '🛠️ **Gestão Avançada do Ticket (Painel Staff)**', components: [new ActionRowBuilder().addComponents(staffMenu)], flags: [MessageFlags.Ephemeral] });
    }

    if (interaction.isStringSelectMenu() && interaction.customId === 'staff_tools_menu') {
        const action = interaction.values[0];
        const creatorId = interaction.channel.topic;

        if (action === 'staff_ping_user') {
            return interaction.reply({ content: creatorId ? `🔔 <@${creatorId}>, a equipa de Staff aguarda a tua resposta!` : '⚠️ Utilizador notificado.' });
        } else if (action === 'staff_rename') {
            const modal = new ModalBuilder().setCustomId('modal_rename').setTitle('Renomear Canal');
            modal.addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('new_name').setLabel('Novo Nome do Ticket').setStyle(TextInputStyle.Short).setRequired(true)));
            return interaction.showModal(modal);
        }
    }

    if (interaction.isModalSubmit() && interaction.customId === 'modal_rename') {
        const newName = interaction.fields.getTextInputValue('new_name');
        await interaction.channel.setName(newName);
        return interaction.reply({ content: `✏️ Canal renomeado para **${newName}** com sucesso.` });
    }

    if (interaction.isButton() && interaction.customId === 'pre_fechar_ticket') {
        await interaction.reply({ content: '⏳ Ticket a fechar. A atualizar canal...', flags: [MessageFlags.Ephemeral] });

        const creatorId = interaction.channel.topic;
        if (creatorId) {
            try { await interaction.channel.permissionOverwrites.edit(creatorId, { SendMessages: false }); } catch (e) {}
        }

        const closedEmbed = new EmbedBuilder()
            .setTitle('🎫 Ticket Fechado')
            .setDescription(`Este ticket foi fechado.\n\n**Fechado por:** ${interaction.user}\n**Ticket:** #${interaction.channel.id.slice(-4)}`)
            .setColor('#8a2be2'); 

        const closedRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('reabrir_ticket').setLabel('Reabrir').setStyle(ButtonStyle.Success).setEmoji('🔓'),
            new ButtonBuilder().setCustomId('deletar_ticket').setLabel('Deletar').setStyle(ButtonStyle.Danger).setEmoji('🗑️')
        );

        const ratingEmbed = new EmbedBuilder()
            .setTitle('⭐ Avaliação do Atendimento')
            .setDescription(`Como avaliaria o atendimento da nossa equipa?\n\n**Ticket:** #${interaction.channel.id.slice(-4)}\n**Criador:** ${creatorId ? `<@${creatorId}>` : 'Desconhecido'}`)
            .setColor('#8a2be2'); 

        const ratingRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('rate_1').setLabel('1').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('rate_2').setLabel('2').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('rate_3').setLabel('3').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('rate_4').setLabel('4').setStyle(ButtonStyle.Primary), 
            new ButtonBuilder().setCustomId('rate_5').setLabel('5').setStyle(ButtonStyle.Success)  
        );

        await interaction.channel.send({ embeds: [closedEmbed], components: [closedRow] });
        await interaction.channel.send({ content: `${creatorId ? `<@${creatorId}>` : ''}` });
        await interaction.channel.send({ embeds: [ratingEmbed], components: [ratingRow] });
        return;
    }

    if (interaction.isButton() && interaction.customId === 'reabrir_ticket') {
        const creatorId = interaction.channel.topic;
        if (creatorId) {
            try { await interaction.channel.permissionOverwrites.edit(creatorId, { SendMessages: true }); } catch (e) {}
        }
        return interaction.reply({ content: `🔓 O ticket foi reaberto por ${interaction.user}.` });
    }

    if (interaction.isButton() && interaction.customId === 'deletar_ticket') {
        if (!interaction.member.roles.cache.has(STAFF_ROLE_ID)) return interaction.reply({ content: '❌ Apenas Staff.', flags: [MessageFlags.Ephemeral] });
        await interaction.reply('🗑️ A apagar o canal em 5 segundos...');
        return setTimeout(async () => { try { await interaction.channel.delete(); } catch(e){} }, 5000);
    }

    if (interaction.isButton() && interaction.customId.startsWith('rate_')) {
        const nota = interaction.customId.split('_')[1];
        await interaction.reply({ content: `⭐ Obrigado! Registaste uma avaliação de **${nota}/5** para este atendimento.` });
        try { await interaction.message.delete(); } catch(e){}
    }
});

client.login(TOKEN);