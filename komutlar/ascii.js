const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('../ayarlar.json');
const snekfetch = require('snekfetch');
const inspect = require('util');



exports.run = (client, message, args) => {
	
	const logger = message.content;
	  let mesaj = args.slice(0).join(' ');

		snekfetch.get(`http://artii.herokuapp.com/make?text=${mesaj}`)
			.then(ascii => {
				const embed = new Discord.RichEmbed()
						.setTitle(mesaj)
						.setAuthor(message.author.tag)
						.setColor(0x00AE86)
						.setDescription(`\`\`\`${ascii.text}\`\`\``)
				message.channel.send(embed);
			})
			.catch(err => {
				const errorDetails = `${err.host ? err.host : ''} ${err.message ? err.message : ''}`.trim();
				message.reply(`Bir hata oluştu: \`${err.code}: ${errorDetails}\``).then(msg => msg.delete(3000));
				return logger.error(inspect(err));
			});
	}



exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'ascii',
  description: 'Mesajınızı ascii formatına çevirir.',
  usage: 'ascii <mesaj>'
};