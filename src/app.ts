const dotenv = require("dotenv");
dotenv.config();

import { Context, Markup, Telegraf } from 'telegraf';
import { Update } from 'typegram';

const Sheets = require("node-sheets").default;

const nameH: string = "Найближчий урок";
const markH: string = "Загальний баланс логіків";

async function getTable() {
    const gs = new Sheets(process.env.SHEET_ID)
    await gs.authorizeApiKey(process.env.GOOGLE_SHEET_KEY);
    const table = await gs.tables("Викладач!A:G");
    return table;
}

function getMarkByName(name: string, table: any) {
    const filteredRows = table.rows.filter((row: any) => {
        if (typeof row !== 'undefined') {
            if (typeof row[nameH] !== "undefined") {
                return typeof row[nameH].stringValue !== "undefined";
            } else {
                return false;
            }
        } else {
            return false;
        }
    })
    const row = filteredRows.find((student: any) => {
        if (student[nameH]) {
            return student[nameH].stringValue.toLowerCase() === name.toLowerCase();
        }
    });
    if (row) {
        return `Кількість логіків ${row[nameH].stringValue} дорівнює: ${row[markH].stringValue} 🧩`;
    } else {
        return `Перевірте вказане ім'я та прізвище на написання. Якщо і надалі бачите це повідомлення, то зверніться до викладача.`
    }
}


const bot: Telegraf<Context<Update>> = new Telegraf(process.env.BOT_TOKEN as string);

bot.start((ctx) => {
    ctx.reply(`Привіт, ${ctx.from.first_name}!
Цей невеликий бот допоможе тобі у тому, щоб дізнатись про свою оцінку і не турбувати викладача👩‍🏫

Для того, щоб дізнатись оцінку введи своє Прізвище Ім'я.
Наприклад:

Дмитро Карпенко`);
});

bot.help((ctx) => {
    ctx.reply('Відправ /start щоб отримати привітання від бота🤖');
    ctx.reply("Відправ <Прізвище> <Ім'я> для отримання оцінки👾");
    ctx.reply('Відправ /quit для зупинки бота 🗑');
});

bot.on('text', async (ctx) => {
    await getTable().then(async (result: any) => {
        ctx.reply(
            getMarkByName(ctx.message.text, result) + "\nДякую за використання цього бота! Зичу успіхів у навчанні ✨"
        );
    });
});

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));