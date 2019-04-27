const Discord = require('discord.js');
const client = new Discord.Client();
const YouTube = require('simple-youtube-api');
const yt = require('ytdl-core');
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const youtube = new YouTube(ayarlar.api);
const fs = require('fs');
const moment = require('moment');
require('./util/eventLoader')(client);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

///////////////////////
///////////////////////
client.on('message',msg=>{
  console.log(`LOG: S: ${msg.guild.name} M: ${msg.content} Y: ${msg.author.tag}`);
  if (msg.content.toLowerCase().match(/(porn|nude|fuck|porno|siktir|orospu|çocuğu|cocugu|sikiş|sikeyim|sikim|sikerim)/g) && msg.channel.type === "text" && msg.channel.permissionsFor(msg.guild.member(client.user)).has("MANAGE_MESSAGES")) {
    msg.delete(30).then(deletedMsg => {
      deletedMsg.reply("Üzgünüm Dostum Bu Sunucuda Küfür Edemezsin!").catch(e => {
        console.error(e);
      });
    }).catch(e => {
      console.error(e);
    });
  }
  if (msg.content.toLowerCase().match(/(discord\.gg\/)|(discordapp\.com\/invite\/)/g) && msg.channel.type === "text" && msg.channel.permissionsFor(msg.guild.member(client.user)).has("MANAGE_MESSAGES")) {
    msg.delete(30).then(deletedMsg => {
      deletedMsg.reply("Discord davet linki paylaştığını algıladık.Bu Sunucu SerchuVa No-Ads İle Korunmakta!").catch(e => {
        console.error(e);
      });
    }).catch(e => {
      console.error(e);
    });
  }
  if (msg.content.toLowerCase() === 'sa') {
		if (msg.author.id==ayarlar.sahip) {
			msg.reply('Oooo REİS Hoşgeldin.'); 
		} else {
		msg.reply('Aleyküm selam, hoş geldin ^^');
		}
  }
  
  if (msg.content.toLowerCase().match(/(_ban|_kick|_kilit|_reboot|_reklam|_sustur|_temizle|_uyar|_unban)/g) && !msg.author.bot && msg.channel.type === "text" && msg.channel.permissionsFor(msg.guild.member(client.user)).has("MANAGE_MESSAGES")) {
    if(msg.author.id!==ayarlar.sahip){
      msg.delete(30).then(deletedMsg => {
        msg.channel.bulkDelete(1);
        deletedMsg.reply("Üzgünüm Dostum Sunucu Sahibi Değilsin!").catch(e => {
          console.error(e);
        });
      }).catch(e => {
        console.error(e);
      });
    }
  }
});

////////////////////////
client.on("guildMemberAdd", member => {

  var channel = member.guild.channels.find("id", "570340180842643458");
  if (!channel) return channel.send('#🙋otoban Kanalını Bulamıyorum :/');

var role = member.guild.roles.find("name", "[EASY] Üye");
if (!role) return channel.send('@[EASY] Üye Rolünü Bulamıyorum :/');

  member.addRole(role);

  channel.send(member + " Artık " + role + " Rolü İle Aramızda Hoşgeldin BRO^M :heart: ");
	member.setNickname('[EASY] '+member.user.username);
  member.send("Aramıza hoş geldin! Artık @[EASY] Üye rolüne sahipsin!");
	member.send("Lütfen #kurallar isimli kanaldan sunucu kurallarını oku.");
});

client.on('guildMemberRemove',member=>{
  var channel = member.guild.channels.find("id", "570340180842643458");
  if (!channel) return channel.send('#🙋otoban Kanalını Bulamıyorum :/');
  channel.send('Beyler, '+member+' aramızdan ayrıldı :weary: . Haberiniz Olsun.')
});


////////////////////////
client.on('channelCreate',channel=>{
console.log(channel.name+' İsimli Kanal Oluşturuldu');
if(channel.type=='text') return channel.send('OooO Yeni Kanal Alırım Bir Dal...\n@everyone Beyler Bakın Yeni Kanal!');
});
////////////////////////
client.on('guildCreate',guild=>{
console.log(guild.name+' İsimli Servere Girdim <3')
});
////////////////////////

////////////////////////
client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;

client.on('warn', e => {
  console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
  console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});
///////////////////////////////////////////////////////////////////////
client.login(process.env.TOKEN);
