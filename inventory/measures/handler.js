'use strict';

const statusCodes = require('beerschema-shared/constants').statusCodes;
const schemaValidator = require('beerschema-shared/validation').validateAgainstSchema;
const sanitizer = require('beerschema-shared/sanitizer');
const path = require('path');
const measuresSchemaPath = path.join(process.cwd(), 'measures.schema.json');
const database = require('./database');

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
};

/**
 * Get one measure
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function getMeasure(event, context, callback) {
  console.log(`${process.env.serviceName}: getMeasure called`);
  database
    .getMeasure(event.pathParameters.id)
    .then((measure) => {
      callback(null, {
        statusCode: statusCodes.OK,
        headers,
        body: JSON.stringify(measure)
      });
    })
    .catch((err) => callback(err));
}

/**
 * Get all measures
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function listMeasures(event, context, callback) {
  // TODO: pagination - I think this is how to get headers: https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html#eventsources-api-gateway-request
  // let page = event.headers['x-pagination-page'];
  // let numItems = event.headers[ 'x-pagination-limit'];
  console.log(`${process.env.serviceName}: listMeasures called`);
  database
    .listMeasures()
    .then((measures) => {
      // headers['x-pagination-page'] = ;
      // headers['x-pagination-total-items'] = ;
      callback(null, {
        statusCode: statusCodes.OK,
        headers,
        body: JSON.stringify(measures)
      });
    })
    .catch((err) => callback(err));
}

/**
 * Create a measure
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function createMeasure(event, context, callback) {
  console.log(`${process.env.serviceName}: createMeasure called`);
  let measure = JSON.parse(event.body);

  // validation
  try {
    measure = sanitizer.sanitizeModel(measure); // get rid of html
    schemaValidator(measure, measuresSchemaPath); // validate against schema
  } catch (error) {
    console.error('createMeasure: Error(s) validating against schema: ', error);
    callback({
      statusCode: statusCodes.BAD_REQUEST,
      headers,
      body: JSON.stringify({ msg: 'Model failed schema validation.', extended: error.message })
    });
    return;
  }

  database
    .createMeasure(measure)
    .then((newMeasure) => {
      callback(null, {
        statusCode: statusCodes.CREATED,
        headers,
        body: JSON.stringify(newMeasure)
      });
    })
    .catch((err) => callback(err));
}

/**
 * Update a measure
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function updateMeasure(event, context, callback) {
  console.log(`${process.env.serviceName}: updateMeasure called`);
  let measure = JSON.parse(event.body);
  measure.id = event.pathParameters.id;

  database
    .getMeasure(measure.id)
    .then((existingMeasure) => {
      measure = Object.assign({}, existingMeasure, measure);
      // validation
      measure = sanitizer.sanitizeModel(measure); // get rid of html
      schemaValidator(measure, measuresSchemaPath); // validate against schema
      return database.updateMeasure(existingMeasure);
    })
    .then((updated) => {
      callback(null, {
        statusCode: statusCodes.OK,
        headers,
        body: JSON.stringify(updated)
      });
    })
    .catch((error) => {
      console.error('updateMeasure: Error(s) validating against schema: ', error);
      callback({
        statusCode: statusCodes.BAD_REQUEST,
        headers,
        body: JSON.stringify({ msg: 'Model failed schema validation.', extended: error.message })
      });
    });
}

/**
 * Delete a measure
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function deleteMeasure(event, context, callback) {
  console.log(`${process.env.serviceName}: deleteMeasure called`);
  database
    .deleteMeasure(event.pathParameters.id)
    .then(() => {
      callback(null, {
        statusCode: statusCodes.NO_CONTENT,
        headers
      });
    })
    .catch((err) => callback(err));
}

module.exports = {
  getMeasure,
  listMeasures,
  createMeasure,
  updateMeasure,
  deleteMeasure
};
