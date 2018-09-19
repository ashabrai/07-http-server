'use strict';

const http = require('http');
const cowsay = require('cowsay');
const logger = require('./logger');
const requestParser = require('./request-parser');


const app = http.createServer((request, response) => {
  logger.log(logger.INFO, 'New Request!!');
  logger.log(logger.INFO, `METHOD: ${request.method}`);
  logger.log(logger.INFO, `ROUTE: ${request.url}`);

  return requestParser.parseAsync(request)
    .then((parsedRequest) => {
      if (parsedRequest.method === 'GET' && parsedRequest.url === '/') {
        response.writeHead(200, { 'Content-Type': 'text/html' });

        response.write(`<!DOCTYPE html>
                  <head>Here's the head</head>
                  <body>Wouldn't it be <a  href="localhost:3000/my-route"> cool to have a cow as a pet?</body>
                  </html>
                  `);
        logger.log(logger.INFO, 'Responding back with 200 status and a HTML document');
        response.end();
        return undefined;
      }
      if (parsedRequest.method === 'POST' && parsedRequest.url === '/api/cowsay') {
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.write(cowsay.say({
          text: "I'm a moooodule",
          e: 'oO',
          T: 'U ',
        }));
        logger.log(logger.INFO, 'Responding back with 200 status code and JSON document');
        response.end();
        return undefined;
      }
      logger.log(logger.INFO, 'Responding with a 404 status code :NOT FOUND');
      response.writeHead(404, { 'Content-Type': 'text/plain' });
      response.write('Not Found');
      response.end();
      return undefined;
    })
    .catch(() => {
      logger.log(logger.INFO, 'Responding back with 400 status code');
      response.writeHead(400, { 'Content-Type': 'text/plain' });
      response.write('Bad Request');

      response.end();
      return undefined;
    });
});

const server = module.exports = {};

server.start = (port) => {
  return app.listen(port, () => {
    logger.log(logger.INFO, `Server is on at PORT: ${port}`);
  });
};
