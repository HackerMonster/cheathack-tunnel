const localtunnel = require('localtunnel');

// Адрес бота на RubyHost
const TARGET_URL = "http://de6.rubyhost.ru:28980";

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
