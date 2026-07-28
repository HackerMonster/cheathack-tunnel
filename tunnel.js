const localtunnel = require('localtunnel');
const http = require('http');

const TARGET_URL = "http://de6.rubyhost.ru:28980";
const PORT = process.env.PORT || 8080;

// HTTP-сервер для Render
const server = http.createServer((req, res) => {
    // Проксируем запросы к боту
    const options = {
        hostname: 'de6.rubyhost.ru',
        port: 28980,
        path: req.url,
        method: req.method,
        headers: req.headers
    };

    const proxy = http.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
    });

    req.pipe(proxy);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Прокси-сервер запущен на порту ${PORT}`);
    console.log(`🎯 Цель: ${TARGET_URL}`);
});

// Туннель для Webhook
(async () => {
    try {
        const tunnel = await localtunnel({
            port: 28980,
            subdomain: "cheathack-bot"
        });

        console.log(`✅ Туннель активен: ${tunnel.url}`);
        console.log(`📡 Webhook: ${tunnel.url}/webhook`);
        console.log(`📡 API: ${tunnel.url}/api/ping`);

        tunnel.on('close', () => {
            console.log('❌ Туннель закрыт');
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Ошибка:', error);
        process.exit(1);
    }
})();
