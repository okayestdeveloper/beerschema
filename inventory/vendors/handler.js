'use strict';

const statusCodes = require('beerschema-shared/constants').statusCodes;
const schemaValidator = require('beerschema-shared/validation').validateAgainstSchema;
const sanitizer = require('beerschema-shared/sanitizer');
const path = require('path');
const vendorsSchemaPath = path.join(process.cwd(), 'vendors.schema.json');
const database = require('./database');

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
};

/**
 * Get one vendor
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function getVendor(event, context, callback) {
  console.log(`${process.env.serviceName}: getVendor called`);
  database
    .getVendor(event.pathParameters.id)
    .then((vendor) => {
      callback(null, {
        statusCode: statusCodes.OK,
        headers,
        body: JSON.stringify(vendor)
      });
    })
    .catch((err) => callback(err));
}

/**
 * Get all vendors
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function listVendors(event, context, callback) {
  // TODO: pagination - I think this is how to get headers: https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html#eventsources-api-gateway-request
  // let page = event.headers['x-pagination-page'];
  // let numItems = event.headers[ 'x-pagination-limit'];
  console.log(`${process.env.serviceName}: listVendors called`);
  database
    .listVendors()
    .then((vendors) => {
      // headers['x-pagination-page'] = ;
      // headers['x-pagination-total-items'] = ;
      callback(null, {
        statusCode: statusCodes.OK,
        headers,
        body: JSON.stringify(vendors)
      });
    })
    .catch((err) => callback(err));
}

/**
 * Create a vendor
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function createVendor(event, context, callback) {
  console.log(`${process.env.serviceName}: createVendor called`);
  let vendor = JSON.parse(event.body);

  // validation
  try {
    vendor = sanitizer.sanitizeModel(vendor); // get rid of html
    schemaValidator(vendor, vendorsSchemaPath); // validate against schema
  } catch (error) {
    console.error('createVendor: Error(s) validating against schema: ', error);
    callback({
      statusCode: statusCodes.BAD_REQUEST,
      headers,
      body: JSON.stringify({ msg: 'Model failed schema validation.', extended: error.message })
    });
    return;
  }

  database
    .createVendor(vendor)
    .then((newVendor) => {
      callback(null, {
        statusCode: statusCodes.CREATED,
        headers,
        body: JSON.stringify(newVendor)
      });
    })
    .catch((err) => callback(err));
}

/**
 * Update a vendor
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function updateVendor(event, context, callback) {
  console.log(`${process.env.serviceName}: updateVendor called`);
  let vendor = JSON.parse(event.body);
  vendor.id = event.pathParameters.id;

  database
    .getVendor(vendor.id)
    .then((existingVendor) => {
      vendor = Object.assign({}, existingVendor, vendor);
      // validation
      vendor = sanitizer.sanitizeModel(vendor); // get rid of html
      schemaValidator(vendor, vendorsSchemaPath); // validate against schema
      return database.updateVendor(existingVendor);
    })
    .then((updated) => {
      callback(null, {
        statusCode: statusCodes.OK,
        headers,
        body: JSON.stringify(updated)
      });
    })
    .catch((error) => {
      console.error('updateVendor: Error(s) validating against schema: ', error);
      callback({
        statusCode: statusCodes.BAD_REQUEST,
        headers,
        body: JSON.stringify({ msg: 'Model failed schema validation.', extended: error.message })
      });
    });
}

/**
 * Delete a vendor
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function deleteVendor(event, context, callback) {
  console.log(`${process.env.serviceName}: deleteVendor called`);
  database
    .deleteVendor(event.pathParameters.id)
    .then(() => {
      callback(null, {
        statusCode: statusCodes.NO_CONTENT,
        headers
      });
    })
    .catch((err) => callback(err));
}

module.exports = {
  getVendor,
  listVendors,
  createVendor,
  updateVendor,
  deleteVendor
};
