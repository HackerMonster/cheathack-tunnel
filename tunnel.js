const localtunnel = require('localtunnel');
const http = require('http');

// Адрес вашего бота на RubyHost
const TARGET_URL = "http://de6.rubyhost.ru:28980";

// Получаем порт от Render или используем 8080 по умолчанию
const PORT = process.env.PORT || 8080;

// --- 1. Создаём простой HTTP-сервер для Render ---
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Туннель активен!\n');
});

// Запускаем сервер на порту, который дал Render
server.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ HTTP-сервер запущен на порту ${PORT}`);
});

// --- 2. Запускаем туннель ---
(async () => {
    try {
        const tunnel = await localtunnel({
            port: 28980,
            subdomain: "cheathack-bot"
        });

        console.log(`✅ Туннель активен: ${tunnel.url}`);
        console.log(`🎯 Цель: ${TARGET_URL}`);
        console.log(`📡 API: ${tunnel.url}/api/avatar`);
        console.log(`🔗 Webhook: ${tunnel.url}/webhook`);

        tunnel.on('close', () => {
            console.log('❌ Туннель закрыт');
            process.exit(0);
        });

        tunnel.on('error', (err) => {
            console.error('❌ Ошибка туннеля:', err);
        });

    } catch (error) {
        console.error('❌ Ошибка запуска туннеля:', error);
        process.exit(1);
    }
})();
