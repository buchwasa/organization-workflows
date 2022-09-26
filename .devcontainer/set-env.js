const fs = require("fs");
const localtunnel = require("localtunnel");
const dotenv = require("dotenv");
const updateDotenv = require("update-dotenv");

(async () => {
  const envConfig = dotenv.parse(fs.readFileSync('./.env'))
  if (envConfig.WEBHOOK_PROXY_URL) {
    console.log("Webhook already exists, not starting a new localtunnel instance");
    
    return;
  }

  const tunnel = await localtunnel({ port: 3000 });

  console.log("Running localtunnel on port 3000 with the url", tunnel.url);

  await updateDotenv({
    WEBHOOK_PROXY_URL: tunnel.url
  })

  tunnel.on('close', () => {
    console.log("Tunnel was closed");
  });
})();