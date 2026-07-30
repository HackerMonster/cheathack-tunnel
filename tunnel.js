const http = require('http');
const url = require('url');

// ===== АДРЕС ВАШЕГО БОТА НА RUBYHOST =====
const TARGET_URL = "http://de6.rubyhost.ru:28980";
const targetParsed = url.parse(TARGET_URL);

// ===== ПОЛУЧАЕМ ПОРТ ОТ RENDER =====
const PORT = process.env.PORT || 8080;

// ===== СОЗДАЁМ HTTP-СЕРВЕР (ПРОКСИ) =====
const server = http.createServer((req, res) => {
    console.log(`📨 Запрос: ${req.method} ${req.url}`);

    const options = {
        hostname: targetParsed.hostname,
        port: targetParsed.port || 80,
        path: req.url,
        method: req.method,
        headers: req.headers
    };

    const proxy = http.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
    });

    req.pipe(proxy);

    proxy.on('error', (err) => {
        console.error('❌ Ошибка прокси:', err.message);
        res.writeHead(502, { 'Content-Type': 'text/plain' });
        res.end(`Bad Gateway: ${err.message}`);
    });
});

// ===== ЗАПУСКАЕМ СЕРВЕР =====
server.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Прокси-сервер запущен на порту ${PORT}`);
    console.log(`🎯 Цель: ${TARGET_URL}`);
});

// ===== ОБРАБОТКА ЗАВЕРШЕНИЯ =====
process.on('SIGINT', () => {
    console.log('⏹️ Сервер остановлен');
    process.exit(0);
});
