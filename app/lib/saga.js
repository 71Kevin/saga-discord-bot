const logger = require('./logger');
const Discord = require('discord.js');
const client = new Discord.Client();

const saga = {
    discord: async () => {
        try {
            client.on('ready', async () => {
                client.user.setPresence({
                    status: 'online',
                    activity: {
                        name: '+help',
                        type: 'PLAYING'
                    }
                })
                logger.info('saga-discord-bot Started');
            });

            let statuses = [{
                activity: {
                    name: `+help`
                },
                type: "PLAYING"
            }];
            let i = 0;

            setInterval(async () => {
                let status = statuses[i];
                if (!status) {
                    status = statuses[0];
                    i = 0;
                }
                client.user.setPresence(status);
                i++;
                logger.info('Successful attempt to change Status');
            }, 1000 * 60 * 60);

            client.on('message', async message => {
                if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;

                const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
                const command = args.shift().toLowerCase();
                const taggedUser = message.mentions.users.first();
                let random;

                if (command === 'ping') {
                    logger.info(`ping by ${message.author}`);
                    await message.channel.send('pong');
                } else if (command === 'help') {
                    logger.info(`help by ${message.author}`);
                    await message.channel.send('Comandos básicos: \n\n +info saga \n +purge número-de-mensagens \n +cosmo @nome-do-usuário \n +quotes \n +summon  \n +avatar \n\n -Bot feito por biscuit_kevin l Tinesh');
                } else if (command === 'info') {
                    logger.info(`info by ${message.author}`);
                    if (!args.length) {
                        return await message.channel.send(`Você não forneceu nenhum argumento, ${message.author}!`);
                    } else if (args[0] === 'saga') {
                        return await message.channel.send(`Saga de Gêmeos também conhecido como "O Mestre do Santuário" é um dos 12 Cavaleiros de Ouro, os mais poderosos dentre todos os 88 cavaleiros responsáveis pela proteção da deusa Athena`, {
                            files: ["app/image/saga-info.gif"]
                        });
                    }
                } else if (command === 'purge') {
                    logger.info(`purge by ${message.author}`);
                    const amount = parseInt(args[0]) + 1;

                    if (isNaN(amount)) {
                        return message.reply('Valor inválido');
                    } else if (amount <= 1 || amount > 100) {
                        return message.reply('É necessário inserir um número entre 1 e 99');
                    }

                    await message.channel.bulkDelete(amount, true).catch(async err => {
                        logger.error(err);
                        await message.channel.send('Ocorreu um erro ao tentar apagar mensagens neste canal');
                    });
                } else if (command === 'cosmo') {
                    logger.info(`cosmo by ${message.author}`);
                    if (!message.mentions.users.size) {
                        return message.reply(`Você precisa marcar um usuário para acertá-lo`);
                    }
                    let skill = [
                        `${message.author} usou Explosão Galática em ${taggedUser.username}`,
                        `${message.author} mandou ${taggedUser.username} para a Outra dimensão`,
                        `${message.author} está controlando ${taggedUser.username} através do Satã Imperial`
                    ];
                    random = Math.floor(Math.random() * skill.length);

                    if (skill[random] === `${message.author} usou Explosão Galática em ${taggedUser.username}`) {
                        await message.channel.send(skill[random], {
                            files: ["app/image/explosao-galactica.gif"]
                        });
                    } else if (skill[random] === `${message.author} mandou ${taggedUser.username} para a Outra dimensão`) {
                        await message.channel.send(skill[random], {
                            files: ["app/image/outra-dimensao.gif"]
                        });
                    } else if (skill[random] === `${message.author} está controlando ${taggedUser.username} através do Satã Imperial`) {
                        await message.channel.send(skill[random], {
                            files: ["app/image/sata-imperial.gif"]
                        });
                    }
                } else if (command === 'quotes') {
                    logger.info(`quotes by ${message.author}`);
                    let quotes = [
                        `Zeus no Céu, Poseidon nos Oceanos e Hades no Mundo dos Mortos, tentaram conquistar esse mundo várias vezes durante os tempos mitológicos… Imagine se um deles, deuses tão poderosos, regesse o mundo?! Os seres humanos e a Terra seriam inevitavelmente destruídos por completo… E exatamente por este mundo estar um verdadeiro caos, ele precisa de um salvador para dominar e governá-lo e eu sou o mais qualificado para isto!`,
                        `FINALMENTE TUDO ACABOU E EU VENCI`
                    ];
                    random = Math.floor(Math.random() * quotes.length);

                    if (quotes[random] === `Zeus no Céu, Poseidon nos Oceanos e Hades no Mundo dos Mortos, tentaram conquistar esse mundo várias vezes durante os tempos mitológicos… Imagine se um deles, deuses tão poderosos, regesse o mundo?! Os seres humanos e a Terra seriam inevitavelmente destruídos por completo… E exatamente por este mundo estar um verdadeiro caos, ele precisa de um salvador para dominar e governá-lo e eu sou o mais qualificado para isto!`) {
                        await message.channel.send(quotes[random], {
                            files: ["app/image/saga-qualificado.gif"]
                        });
                    } else if (quotes[random] === `FINALMENTE TUDO ACABOU E EU VENCI`) {
                        await message.channel.send(quotes[random], {
                            files: ["app/image/saga-risada.gif"]
                        });
                    }
                } else if (command === 'summon') {
                    const channel = message.member.voice.channel;
                    message.guild.members.cache.forEach(async member => {
                        if (member.id === message.member.id || !member.voice.channel) return;
                        member.voice.setChannel(channel);
                    });
                    await message.channel.send(`${message.author} invocou todos os usuários para o canal onde está!`);
                } else if (command === 'avatar') {
                    let user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
                    let avatar = user.avatarURL({
                        dynamic: true,
                        format: "png",
                        size: 1024
                    });
                    let embed = new Discord.MessageEmbed()
                        .setColor(`#00000`)
                        .setTitle(`Avatar de ${user.username}`)
                        .setImage(avatar)
                        .setFooter(`• Autor: ${message.author.tag}`, message.author.displayAvatarURL({
                            format: "png"
                        }));
                    await message.channel.send(embed);
                }
            });
            client.login(process.env.TOKEN);
        } catch (e) {
            logger.error(e.message);
        }
    }
};

module.exports = saga;
