'use strict';

const statusCodes = require('beerschema-shared/constants').statusCodes;
const schemaValidator = require('beerschema-shared/validation').validateAgainstSchema;
const sanitizer = require('beerschema-shared/sanitizer');
const path = require('path');
const inventoryItemsSchemaPath = path.join(process.cwd(), 'inventoryItems.schema.json');
const database = require('./database');

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
};

/**
 * Get one inventoryItem
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function getInventoryItem(event, context, callback) {
  console.log(`${process.env.serviceName}: getInventoryItem called`);
  database
    .getInventoryItem(event.pathParameters.id)
    .then((inventoryItem) => {
      callback(null, {
        statusCode: statusCodes.OK,
        headers,
        body: JSON.stringify(inventoryItem)
      });
    })
    .catch((err) => callback(err));
}

/**
 * Get all inventoryItems
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function listInventoryItems(event, context, callback) {
  // TODO: pagination - I think this is how to get headers: https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html#eventsources-api-gateway-request
  // let page = event.headers['x-pagination-page'];
  // let numItems = event.headers[ 'x-pagination-limit'];
  console.log(`${process.env.serviceName}: listInventoryItems called`);
  database
    .listInventoryItems()
    .then((inventoryItems) => {
      // headers['x-pagination-page'] = ;
      // headers['x-pagination-total-items'] = ;
      callback(null, {
        statusCode: statusCodes.OK,
        headers,
        body: JSON.stringify(inventoryItems)
      });
    })
    .catch((err) => callback(err));
}

/**
 * Create a inventoryItem
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function createInventoryItem(event, context, callback) {
  console.log(`${process.env.serviceName}: createInventoryItem called`);
  let inventoryItem = JSON.parse(event.body);

  // validation
  try {
    inventoryItem = sanitizer.sanitizeModel(inventoryItem); // get rid of html
    schemaValidator(inventoryItem, inventoryItemsSchemaPath); // validate against schema
  } catch (error) {
    console.error('createInventoryItem: Error(s) validating against schema: ', error);
    callback({
      statusCode: statusCodes.BAD_REQUEST,
      headers,
      body: JSON.stringify({ msg: 'Model failed schema validation.', extended: error.message })
    });
    return;
  }

  database
    .createInventoryItem(inventoryItem)
    .then((newInventoryItem) => {
      callback(null, {
        statusCode: statusCodes.CREATED,
        headers,
        body: JSON.stringify(newInventoryItem)
      });
    })
    .catch((err) => callback(err));
}

/**
 * Update a inventoryItem
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function updateInventoryItem(event, context, callback) {
  console.log(`${process.env.serviceName}: updateInventoryItem called`);
  let inventoryItem = JSON.parse(event.body);
  inventoryItem.id = event.pathParameters.id;

  database
    .getInventoryItem(inventoryItem.id)
    .then((existingInventoryItem) => {
      inventoryItem = Object.assign({}, existingInventoryItem, inventoryItem);
      // validation
      inventoryItem = sanitizer.sanitizeModel(inventoryItem); // get rid of html
      schemaValidator(inventoryItem, inventoryItemsSchemaPath); // validate against schema
      return database.updateInventoryItem(existingInventoryItem);
    })
    .then((updated) => {
      callback(null, {
        statusCode: statusCodes.OK,
        headers,
        body: JSON.stringify(updated)
      });
    })
    .catch((error) => {
      console.error('updateInventoryItem: Error(s) validating against schema: ', error);
      callback({
        statusCode: statusCodes.BAD_REQUEST,
        headers,
        body: JSON.stringify({ msg: 'Model failed schema validation.', extended: error.message })
      });
    });
}

/**
 * Delete a inventoryItem
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function deleteInventoryItem(event, context, callback) {
  console.log(`${process.env.serviceName}: deleteInventoryItem called`);
  database
    .deleteInventoryItem(event.pathParameters.id)
    .then(() => {
      callback(null, {
        statusCode: statusCodes.NO_CONTENT,
        headers
      });
    })
    .catch((err) => callback(err));
}

module.exports = {
  getInventoryItem,
  listInventoryItems,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem
};
