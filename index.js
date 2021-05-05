const fs = require('fs');
require('dotenv').config();
const Discord = require('discord.js');
const { prefix } = require('./config.json');
const token = process.env.TOKEN;

/*
  Documentation

  Read more:
  https://discordjs.guide/command-handling/adding-features.html#required-arguments

*/

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

client.on('ready', () => {
  console.info(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
  
	if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  if (command.args && !args.length) {
    return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
  }
  
	try {
    command.execute(message, args);
	} catch (error) {
    console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.login(token);