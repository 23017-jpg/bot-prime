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
// process.env.TOKEN vai ler a variável secreta que vais configurar no Render.
// Se testares no PC, podes substituir 'TEU_TOKEN_AQUI' temporariamente.
const TOKEN = process.env.TOKEN || 'MTUyNDEyMTEwOTI5NTkyMzI3MA.GvKUbn.t8OJpu_81tV73jYVkYGe__8NTcGK-fP4ZKtYsA'; 
const CLIENT_ID = '1524121109295923270'; 
const STAFF_ROLE_ID = '1523402615592058899'; 

// --- CONFIGURAÇÕES DE CANAIS E CARGOS ---
const VERIFIED_ROLE_ID = '1523402615273165013'; 
const CANAL_SUGESTOES_ID = '1523402617609257204'; 

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

// Corrigido para 'clientReady' para evitar avisos de funções antigas no Render
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
                    .setDescription('🎯 Categoria para pedidos específicos desta área. Explica o contexto para um atendimento mais rápido')
                    .setEmoji('👑'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Assuntos Gerais')
                    .setValue('1523402616204165177')
                    .setDescription('🎯 Categoria para pedidos específicos desta área. Explica o contexto para um atendimento mais rápido')
                    .setEmoji('🌐'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Reportar Jogador')
                    .setValue('1523402616204165176')
                    .setDescription('🎯 Categoria para pedidos específicos desta área. Explica o contexto para um atendimento mais rápido')
                    .setEmoji('🛑'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Vips e Doações')
                    .setValue('1523402616204165170')
                    .setDescription('🎯 Categoria para pedidos específicos desta área. Explica o contexto para um atendimento mais rápido')
                    .setEmoji('💎'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Streamer')
                    .setValue('1523402616204165178')
                    .setDescription('🎯 Categoria para pedidos específicos desta área. Explica o contexto para um atendimento mais rápido')
                    .setEmoji('🎥'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Ban Appeals')
                    .setValue('1523402616204165174')
                    .setDescription('🎯 Categoria para pedidos específicos desta área. Explica o contexto para um atendimento mais rápido')
                    .setEmoji('🚫'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Organizações')
                    .setValue('1523402616204165172')
                    .setDescription('🎯 Categoria para pedidos específicos desta área. Explica o contexto para um atendimento mais rápido')
                    .setEmoji('💀'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Bugs')
                    .setValue('1523402616204165173')
                    .setDescription('🎯 Categoria para pedidos específicos desta área. Explica o contexto para um atendimento mais rápido')
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

            const welcomeText = `<@&${STAFF_ROLE_ID}>\n\n` +
                                `👋 Olá **${interaction.