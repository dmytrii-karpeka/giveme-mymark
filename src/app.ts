import { Context, Markup, Telegraf } from 'telegraf';
import { Update } from 'typegram';
console.log(process.env);
const bot: Telegraf<Context<Update>> = new Telegraf(process.env.BOT_TOKEN as string);

bot.start((ctx) => {
    ctx.reply('Привіт ' + ctx.from.first_name + '!');
    ctx.reply('Цей невеликий бот допоможе тобі у тому, щоб дізнатись про свою оцінку і не турбувати викладача.');
    ctx.reply("Для того, щоб дізнатись оцінку введи своє Прізвище Ім'я\nНаприклад:");
    ctx.reply("Карпека Дмитрій");
});

bot.help((ctx) => {
    ctx.reply('Відправ /start щоб отримати привітання від бота🤖');
    ctx.reply("Відправ <Прізвище> <Ім'я> для отримання оцінки👾");
    ctx.reply('Відправ /quit для зупинки бота');
});


bot.on('text', async (ctx) => {
    ctx.reply(
        "Дякую за використання цього бота!"
    );
});

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));