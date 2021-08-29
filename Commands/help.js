module.exports = {
    name: 'help',
    execute(Discord, client, func, message, args){
        try{
            message.channel.send("**!szülinap** - Kiírja mit írhatsz !szülinap után. \n**!szülinap formátum** - Kiírja hogyan fogadja el a dátumot. \n**!szülinap [születési dátum]** - Regisztrálja a születési dátumod. \n**!frissít** - Lefrissíti a bot, hogy van-e ma születésnapos. \n**!módosítás @user [dátum]** - Felülírja @user-nek a dátumát. (__Modoknak!__) \n**!parancsok** - Kiírja a parancsokat.");
        } catch(err) {
            message.channel.send("Error #H0");
            console.log("Error: #H0", err);
        }
    }
}