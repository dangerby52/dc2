var Jimp = require("jimp");
exports.run = function(client, message, args) {
  let imageurl = args[0] === undefined ? message.attachments.first() : { url: args[0] };

     if (imageurl === undefined) {
         message.channel.send("**Bir resim ekle**");
         return;
     }

     imageurl = imageurl.url;

     Jimp.read(imageurl).then(function (image) {
        image.quality(10)
             .getBuffer(Jimp.MIME_JPEG, (error, buffer) => {
             message.channel.send("", {
                 files: [{
                     attachment: buffer,
                     name: "serchuva.jpeg"
                 }]
             });
         });
     });
  }

  exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [''],
    permLevel: 0
  };
  
  exports.help = {
    name: 'jpeg',
    description: 'resmin kalitesini düşürür.',
    usage: 'jpeg <resim url>'
  };
