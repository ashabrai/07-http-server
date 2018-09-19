'use strict';

const url = require('url');
const queryString = require('querystring');
const logger = require('./logger');

const requestParser = module.exports = {};

/**
 * Request parser WILL parse the bodies of POST and PUT requests.
 * @param request
 * @returns {Promise<any>}
 */
requestParser.parseAsync = (request) => {
  return new Promise((resolve, reject) => {
    logger.log(logger.INFO, `Original URL: ${request.url}`);

    if (request.method !== 'POST' && request.method !== 'PUT') {
      return resolve(request);
    }

    let allOfBody = '';

    request.on('data', (buffer) => {
      allOfBody += buffer.toString();
    });

    request.on('end', () => {
      try {
        request.body = JSON.parse(allOfBody);
        return resolve(request);
      } catch (error) {
        return reject(error);
      }
    });
    return undefined;
  });
};
