// webParser.js
const axios = require('axios');
const cheerio = require('cheerio');
const Database = require('./database');

async function parseForumPage(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const messages = [];

        // Пример парсинга ID сообщений, логинов и текстов сообщений с 4pda.to
        $('.forum-post').each((index, element) => {
            const messageID = $(element).attr('data-post-id');
            const username = $(element).find('.forum-post__username').text();
            const text = $(element).find('.forum-post__message-text').html();

            if (messageID && username && text) {
                messages.push({ ID: messageID, name: username, message: text });
            }
        });

        return messages;
    } catch (error) {
        console.error('Ошибка при запросе страницы:', error.message);
        return [];
    }
}

// Подключение к базе данных
const db = new Database('./database.db');

// Пример использования парсера и запись в базу данных
const forumURL = 'https://4pda.to/forum/index.php?showtopic=248440&st=0';
parseForumPage(forumURL)
    .then((messages) => {
        // Добавление записей в базу данных
        messages.forEach((message) => {
            db.Add(message, (err) => {
                if (!err) {
                    console.log(`Запись с ID ${message.ID} добавлена в базу данных.`);
                } else {
                    console.error(`Ошибка при добавлении записи с ID ${message.ID}:`, err.message);
                }
            });
        });
    })
    .catch((err) => {
        console.error('Ошибка при парсинге страницы:', err.message);
    });
