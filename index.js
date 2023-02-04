import TelegramBot from 'node-telegram-bot-api';
import * as dotenv from 'dotenv';
import { gameOptions, againOptions } from './options.js';

dotenv.config();

const { TELEGRAM_BOT_TOKEN } = process.env;

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    'Сейчас я загадаю цифру от 0 до 9, а ты должен её угадать!'
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber.toString();
  await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
};

const start = () => {
  bot.setMyCommands([
    {
      command: '/start',
      description: 'Начало работы',
    },
    {
      command: '/info',
      description: 'Получить информацию о пользователе',
    },
    {
      command: '/game',
      description: 'Игра - угадай цифру',
    },
  ]);

  bot.on('message', async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === '/start') {
      await bot.sendSticker(
        chatId,
        'https://tlgrm.eu/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/7.webp'
      );

      return bot.sendMessage(
        chatId,
        `Добро пожаловать в телеграм бот автора typ99`
      );
    }

    if (text === '/info') {
      return bot.sendMessage(
        chatId,
        `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`
      );
    }

    if (text === '/game') {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй ещё раз!');
  });

  bot.on('callback_query', async (msg) => {
    const data = msg.data.toString();
    const chatId = msg.message.chat.id;

    if (data === '/again') {
      return startGame(chatId);
    }

    if (data === chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Поздравляю, ты отгадал цифру ${chats[chatId]}`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatId,
        `К сожалению ты не угадал, бот загадал цифру ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();
