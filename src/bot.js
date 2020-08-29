const {
    client,
    Attachment,
    Client
} = require('discord.js');
const bot = new Client();
const token = 'NzQ5Mjg1MDE0NjYyODA3NzEz.X0pwDA.1zuwvkrqIz09ksxFFwc0sRqJoCY';
const PREFIX = "!";

var servers = {}

const ytdl = require('ytdl-core');  

bot.on('ready', () => {
    console.log(`${bot.user.tag} has logged in`)
});

bot.on('message', (message) => {
    let args = message.content.substring(PREFIX.length).split(" ");

    switch(args[0]){
        case 'play':

        function play(connection, message){
            var server = servers[message.guild.id];

            server.dispatcher = connection.play(ytdl(server.queue[0], {filter: "audioonly"}));

            server.queue.shift();

            server.dispatcher.on("finish", function(){
                if(server.queue[0]){
                    play(connection, message);
                }
                else
                {
                    connection.disconnect;
                }
            })
        }
        if(!args[1]){
            message.channel.send("Song ka link to de bhosdike!!!")
            return;
        }
        if(!message.member.voice.channel){
            message.channel.send("Pehle Channel me jaa fir song bajega bc.")
            return;
        }
        if(!servers[message.guild.id]) servers[message.guild.id] = {
            queue: []
        }
        var server = servers[message.guild.id];

        server.queue.push(args[1]);

        if(!message.member.voice.connection) message.member.voice.channel.join().then(function(connection){
            play(connection, message);

        })



        break;

        case 'skip':
            var server = servers[message.guild.id];
            if(server.dispatcher) server.dispatcher.end();
            message.channel.send("Skip kardiya, khush ab?")
        break;

        case 'stop':
            var server = servers[message.guild.id];
            if(message.member.voice.connection){
                for(var i =server.queue.length -1; i >=0; i--){
                    server.queue.splice(i, 1);
                }

                server.dispatcher.end();
                message.channel.send("Songs bandh kar rha hu bc!")
                console.log("stopped the queue")
            }

            if(message.member.connection) message.guild.voice.connection.disconnect();
        break;

    }
});



bot.login(token)