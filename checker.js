const fs = require('fs');
const axios = require('axios');


const proxyFile = 'proxies.txt';
const liveFile = 'live.txt';

const timeout = 5000;
const concurrentRequests = 100;
const proxyList = fs.readFileSync(proxyFile, 'utf-8').split('\n').filter(Boolean);


const checkProxy = async (proxy) => {
  try {

    const response = await axios.get('http://google.com', {
      proxy: {
        host: proxy.split(':')[0],
        port: proxy.split(':')[1],
        protocol: 'http',
      },
      timeout: timeout,
    });


    console.log(`${proxy} is live.`);


    fs.appendFileSync(liveFile, `${proxy}\n`);
  } catch (error) {

    console.error(`${proxy} is not live. Error: ${error.message}`);
  }
};


const checkAllProxiesConcurrently = async () => {
  const promises = proxyList.map(checkProxy);
  await Promise.all(promises);
};


checkAllProxiesConcurrently().then(() => {
  console.log('Kontrol tamamlandı. Çalışan proxy\'ler "live.txt" dosyasına kaydedildi.');
}).catch((err) => {
  console.error('Bir hata oluştu:', err);
});
