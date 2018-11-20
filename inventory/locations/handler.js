'use strict';

const statusCodes = require('beerschema-shared/constants').statusCodes;
const schemaValidator = require('beerschema-shared/validation').validateAgainstSchema;
const sanitizer = require('beerschema-shared/sanitizer');
const path = require('path');
const locationsSchemaPath = path.join(process.cwd(), 'locations.schema.json');
const database = require('./database');

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
};

/**
 * Get one location
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function getLocation(event, context, callback) {
  console.log(`${process.env.serviceName}: getLocation called`);
  database
    .getLocation(event.pathParameters.id)
    .then((location) => {
      callback(null, {
        statusCode: statusCodes.OK,
        headers,
        body: JSON.stringify(location)
      });
    })
    .catch((err) => callback(err));
}

/**
 * Get all locations
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function listLocations(event, context, callback) {
  // TODO: pagination - I think this is how to get headers: https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html#eventsources-api-gateway-request
  // let page = event.headers['x-pagination-page'];
  // let numItems = event.headers[ 'x-pagination-limit'];
  console.log(`${process.env.serviceName}: listLocations called`);
  database
    .listLocations()
    .then((locations) => {
      // headers['x-pagination-page'] = ;
      // headers['x-pagination-total-items'] = ;
      callback(null, {
        statusCode: statusCodes.OK,
        headers,
        body: JSON.stringify(locations)
      });
    })
    .catch((err) => callback(err));
}

/**
 * Create a location
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function createLocation(event, context, callback) {
  console.log(`${process.env.serviceName}: createLocation called`);
  let location = JSON.parse(event.body);

  // validation
  try {
    location = sanitizer.sanitizeModel(location); // get rid of html
    schemaValidator(location, locationsSchemaPath); // validate against schema
  } catch (error) {
    console.error('createLocation: Error(s) validating against schema: ', error);
    callback({
      statusCode: statusCodes.BAD_REQUEST,
      headers,
      body: JSON.stringify({ msg: 'Model failed schema validation.', extended: error.message })
    });
    return;
  }

  database
    .createLocation(location)
    .then((newLocation) => {
      callback(null, {
        statusCode: statusCodes.CREATED,
        headers,
        body: JSON.stringify(newLocation)
      });
    })
    .catch((err) => callback(err));
}

/**
 * Update a location
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function updateLocation(event, context, callback) {
  console.log(`${process.env.serviceName}: updateLocation called`);
  let location = JSON.parse(event.body);
  location.id = event.pathParameters.id;

  database
    .getLocation(location.id)
    .then((existingLocation) => {
      location = Object.assign({}, existingLocation, location);
      // validation
      location = sanitizer.sanitizeModel(location); // get rid of html
      schemaValidator(location, locationsSchemaPath); // validate against schema
      return database.updateLocation(existingLocation);
    })
    .then((updated) => {
      callback(null, {
        statusCode: statusCodes.OK,
        headers,
        body: JSON.stringify(updated)
      });
    })
    .catch((error) => {
      console.error('updateLocation: Error(s) validating against schema: ', error);
      callback({
        statusCode: statusCodes.BAD_REQUEST,
        headers,
        body: JSON.stringify({ msg: 'Model failed schema validation.', extended: error.message })
      });
    });
}

/**
 * Delete a location
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function deleteLocation(event, context, callback) {
  console.log(`${process.env.serviceName}: deleteLocation called`);
  database
    .deleteLocation(event.pathParameters.id)
    .then(() => {
      callback(null, {
        statusCode: statusCodes.NO_CONTENT,
        headers
      });
    })
    .catch((err) => callback(err));
}

module.exports = {
  getLocation,
  listLocations,
  createLocation,
  updateLocation,
  deleteLocation
};
