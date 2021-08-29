// Creating client aka. the bot
//const client = new Discord.Client();
// returns <Client>

// Get a Guild by ID
//client.guilds.cache.get(id)
// returns <Guild>

// Get a Channel by Name
//message.guild.channels.find(channel => channel.name === "channel-name");
// returns <Channel>

// Get a Channel by ID
//client.channels.cache.get(id)
// returns <Channel>

// Get a GuildChannel by ID
//guild.channels.cache.get(id);
// returns <GuildChannel>

// Send Message to custom Channel
//client.channels.cache.get(id).send("Message");
// Promise <...>

// Find Role by name
//<Guild>.roles.cache.find(role => role.name === 'roleName');
// returns <Role>

// Get User by Message
//message.author
// returns <User>

// Get GuildMember by ID
//guild.members.cache.get(id);
// returns <GuildMember>

// Add Role to GuildMember
//<GuildMember>.roles.add(<Role>);
// Promise <GuildMember>

// If GuildMember has Role
//if (<GuildMember>.roles.cache.some(role => role.name === 'roleName')) { //Do something } ); }

// Mention someone:
//`<@${<User>.id}>`

//That is intentional behaviour. The messages must be cached before expecting events from them. You can get around this by fetching them on startup or something of the like.

//The problem you have here is you are getting a <User> object instead of a <GuildMember> object. Users are not associated with a guild and therefore cannot have roles. You typically want to use a user when it doesn't involve guild specific actions (like Direct Messaging)
//You cannot get a Member from the Client object directly, however you can get 
//Client.guilds.cache 
//and then retrieve the guild, followed by the member from the Guild object using 
//Guild.members.cache.


//<Role>.members returns a collection of GuildMembers. Simply map this collection to get the property you want.
//
//Here's an example according to your scenario:
//
//message.guild.roles.get('415665311828803584').members.map(m=>m.user.tag);
//This will output an array of user tags from members that have the "go4" role. Now you can .join(...) this array to your desired format.
//
//Also, guild.member(message.mentions.users.first()).addRole('415665311828803584'); could be shortened down to: message.mentions.members.first().addRole('415665311828803584');

//Here's a rough example of how it would look as a result:

//client.on("message", message => {

//if(message.content.startsWith(`${prefix}go4-add`)) {
    //message.mentions.members.first().addRole('415665311828803584'); // gets the <GuildMember> from a mention and then adds the role to that member                     
//}

//if(message.content == `${prefix}go4-list`) {
//    const ListEmbed = new Discord.RichEmbed()
//        .setTitle('Users with the go4 role:')
//        .setDescription(message.guild.roles.get('415665311828803584').members.map(m=>m.user.tag).join('\n'));
//    message.channel.send(ListEmbed);                    
//}
//});




// Discord collection (methods, etc.)
//https://discord.js.org/#/docs/collection/master/class/Collection

// Node basics
//https://www.nodebeginner.org

// Modules
//https://js.evie.dev/modules

// Command with arguments
//https://anidiots.guide/first-bot/command-with-arguments

// Command Handler
//https://anidiots.guide/first-bot/a-basic-command-handler

// Discord Roles
//https://anidiots.guide/understanding/roles
