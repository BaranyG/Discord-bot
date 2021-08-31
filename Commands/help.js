module.exports = {
    name: 'help',
    execute(Discord, client, message, args, func){
        try{
            message.channel.send(
                "**!birthday** - Kiírja mit írhatsz !!birthday* után."
                +"\n**!!birthday* format** - Kiírja hogyan fogadja el a dátumot."
                +"\n**!!birthday* [születési dátum]** - Regisztrálja a születési dátumod."
                +"\n**!refresh/reload** - Lefrissíti a bot, hogy van-e ma születésnapos."
                +"\n**!modify @user [dátum]** - Felülírja @user-nek a dátumát. (__Modoknak!__)"
                +"\n**!help** - Kiírja a parancsokat.");
        } catch(err) {
            message.channel.send("Error #H0");
            console.log("Error: #H0", err);
        }
    }
}