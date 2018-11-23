'use strict';

const statusCodes = require('beerschema-shared/constants').statusCodes;
const schemaValidator = require('beerschema-shared/validation').validateAgainstSchema;
const sanitizer = require('beerschema-shared/sanitizer');
const path = require('path');
const periodsSchemaPath = path.join(process.cwd(), 'periods.schema.json');
const database = require('./database');

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
};

/**
 * Get one period
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function getPeriod(event, context, callback) {
  console.log(`${process.env.serviceName}: getPeriod called`);
  database
    .getPeriod(event.pathParameters.id)
    .then((period) => {
      callback(null, {
        statusCode: statusCodes.OK,
        headers,
        body: JSON.stringify(period)
      });
    })
    .catch((err) => callback(err));
}

/**
 * Get all periods
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function listPeriods(event, context, callback) {
  // TODO: pagination - I think this is how to get headers: https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html#eventsources-api-gateway-request
  // let page = event.headers['x-pagination-page'];
  // let numItems = event.headers[ 'x-pagination-limit'];
  console.log(`${process.env.serviceName}: listPeriods called`);
  database
    .listPeriods()
    .then((periods) => {
      // headers['x-pagination-page'] = ;
      // headers['x-pagination-total-items'] = ;
      callback(null, {
        statusCode: statusCodes.OK,
        headers,
        body: JSON.stringify(periods)
      });
    })
    .catch((err) => callback(err));
}

/**
 * Create a period
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function createPeriod(event, context, callback) {
  console.log(`${process.env.serviceName}: createPeriod called`);
  let period = JSON.parse(event.body);

  // validation
  try {
    period = sanitizer.sanitizeModel(period); // get rid of html
    schemaValidator(period, periodsSchemaPath); // validate against schema
  } catch (error) {
    console.error('createPeriod: Error(s) validating against schema: ', error);
    callback({
      statusCode: statusCodes.BAD_REQUEST,
      headers,
      body: JSON.stringify({ msg: 'Model failed schema validation.', extended: error.message })
    });
    return;
  }

  database
    .createPeriod(period)
    .then((newPeriod) => {
      callback(null, {
        statusCode: statusCodes.CREATED,
        headers,
        body: JSON.stringify(newPeriod)
      });
    })
    .catch((err) => callback(err));
}

/**
 * Update a period
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function updatePeriod(event, context, callback) {
  console.log(`${process.env.serviceName}: updatePeriod called`);
  let period = JSON.parse(event.body);
  period.id = event.pathParameters.id;

  database
    .getPeriod(period.id)
    .then((existingPeriod) => {
      period = Object.assign({}, existingPeriod, period);
      // validation
      period = sanitizer.sanitizeModel(period); // get rid of html
      schemaValidator(period, periodsSchemaPath); // validate against schema
      return database.updatePeriod(existingPeriod);
    })
    .then((updated) => {
      callback(null, {
        statusCode: statusCodes.OK,
        headers,
        body: JSON.stringify(updated)
      });
    })
    .catch((error) => {
      console.error('updatePeriod: Error(s) validating against schema: ', error);
      callback({
        statusCode: statusCodes.BAD_REQUEST,
        headers,
        body: JSON.stringify({ msg: 'Model failed schema validation.', extended: error.message })
      });
    });
}

/**
 * Delete a period
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function deletePeriod(event, context, callback) {
  console.log(`${process.env.serviceName}: deletePeriod called`);
  database
    .deletePeriod(event.pathParameters.id)
    .then(() => {
      callback(null, {
        statusCode: statusCodes.NO_CONTENT,
        headers
      });
    })
    .catch((err) => callback(err));
}

module.exports = {
  getPeriod,
  listPeriods,
  createPeriod,
  updatePeriod,
  deletePeriod
};
