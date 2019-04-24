const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('../ayarlar.json');

var prefix = ayarlar.prefix;

var fortunes = [
  "evet",
  "hayır",
  "belki",
  "olabilir",
  "olmayabilir",
  "daha sonra tekrar sor"
];

exports.run = (client, message, args) => {
let mesaj = args.slice(0).join(' ');
if (mesaj.length < 1) return message.reply('Reklam Yapmam İçin Birşeyler Yazmalısın');
message.channel.send(mesaj+' @everyone')
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 3
};

exports.help = {
  name: 'reklam',
  description: 'Bota reklam yaptırır.',
  usage: 'reklam'
};
