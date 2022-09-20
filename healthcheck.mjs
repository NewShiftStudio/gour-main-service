'use strict';

import net from 'node:net';
import { config } from 'dotenv';
config();

const PORT = process.env.PORT || 5002;
const HOST = process.env.HOST || '127.0.0.1';

const client = new net.Socket();
client.connect(PORT, HOST, function () {
  console.info(`Healthcheck success! Connected to PORT: ${PORT}`);
  process.exit(0);
});

client.on('error', function (err) {
  console.info('Healthcheck reject', err);
  client.destroy();
  process.exit(1);
});
