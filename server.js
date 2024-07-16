#!/usr/bin/env node

const express = require('express');
const next = require('next');
const { resolve } = require('path');
const { readFile, readFileSync } = require('fs');

const app = next({ dev: false, dir: __dirname });
const handle = app.getRequestHandler();
const CONFIG_PATH = 'mock-event-stream-config.json';

const importConfig = () => {
  try {
    const resolvedPath = resolve(process.cwd(), CONFIG_PATH);
    return JSON.parse(readFileSync(resolvedPath, 'utf8'));
  } catch (err) {
    console.error(`Configuration "${CONFIG_PATH}" not found or invalid JSON`);
    return {};
  }
};

const generateChunkedResponse = (text, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
};

const run = async () => {
  const config = importConfig();

  const port = config.port || 5000;
  const dataFilePath = resolve(process.cwd(), 'mock-event-stream-data.json');
  const latency = config.latency || 1000;

  await app.prepare();

  const server = express();

  server.get('/query/:q', (req, res) => {
    const { q } = req.params;
    const decodedQuery = decodeURIComponent(q);

    readFile(dataFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading data file:', err);
        return res.status(500).send('Internal Server Error.');
      }

      let jsonData;
      try {
        jsonData = JSON.parse(data);
      } catch (parseErr) {
        console.error('Error parsing JSON data:', parseErr);
        return res.status(500).send('Internal Server Error.');
      }

      const responseText = jsonData[decodedQuery];
      if (!responseText) {
        return res.status(404).send('Query not found.');
      }

      const isEventSourceRequest =
        req.headers.accept && req.headers.accept.includes('text/event-stream');

      if (isEventSourceRequest) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        let chunks = generateChunkedResponse(responseText, 20);
        let index = 0;

        const interval = setInterval(() => {
          if (index < chunks.length) {
            res.write(`data: ${chunks[index]}\n\n`);
            index++;
          } else {
            clearInterval(interval);
            res.write('event: end\ndata: end\n\n');
            res.end();
          }
        }, latency); 

        const errorTimeout = req.query.errorTimeout;
        if (errorTimeout) {
          setTimeout(() => {
            clearInterval(interval);
            res.end();
          }, parseInt(errorTimeout));
        }
      } else {
        res.json({ text: responseText });
      }
    });
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.clear();
    console.log(`🚀 Test dashboard running on http://localhost:${port} \n`);
    console.log(`🚀 Query API Route: /query/[q]\n`);
    console.log(`🚀 Data Edit API Route: /editor\n`);
  });
};

run();
