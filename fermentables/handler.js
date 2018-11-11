'use strict';

const statusCodes = require('beerschema-shared/constants').statusCodes;
const schemaValidator = require('beerschema-shared/validation').validateAgainstSchema;
const sanitizer = require('beerschema-shared/sanitizer');
const path = require('path');
const fermentablesSchemaPath = path.join(process.cwd(), 'fermentables.schema.json');
const database = require('./database');

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
};

/**
 * Get one fermentable
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function getFermentable(event, context, callback) {
    console.log(`${process.env.serviceName}: getFermentable called`);
    database.getFermentable(event.pathParameters.id)
        .then((fermentable) => {
            callback(null, {
                statusCode: statusCodes.OK,
                headers,
                body: JSON.stringify(fermentable)
            });
        })
        .catch((err) => callback(err));
}

/**
 * Get all fermentables
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function listFermentables(event, context, callback) {
    // TODO: pagination - I think this is how to get headers: https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html#eventsources-api-gateway-request
    // let page = event.headers['x-pagination-page'];
    // let numItems = event.headers[ 'x-pagination-limit'];
    console.log(`${process.env.serviceName}: listFermentables called`);
    database.listFermentables()
        .then((fermentables) => {
            // headers['x-pagination-page'] = ;
            // headers['x-pagination-total-items'] = ;
            callback(null, {
                statusCode: statusCodes.OK,
                headers,
                body: JSON.stringify(fermentables)
            });
        })
        .catch((err) => callback(err));
}

/**
 * Create a fermentable
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function createFermentable(event, context, callback) {
    console.log(`${process.env.serviceName}: createFermentable called`);
    let fermentable = JSON.parse(event.body);

    // validation
    try {
        fermentable = sanitizer.sanitizeModel(fermentable); // get rid of html
        schemaValidator(fermentable, fermentablesSchemaPath); // validate against schema
    } catch (error) {
        console.error('createFermentable: Error(s) validating against schema: ', error);
        callback({
            statusCode: statusCodes.BAD_REQUEST,
            headers,
            body: JSON.stringify({ msg: 'Model failed schema validation.', extended: error.message })
        });
        return;
    }

    database.createFermentable(fermentable)
        .then((newFermentable) => {
            callback(null, {
                statusCode: statusCodes.CREATED,
                headers,
                body: JSON.stringify(newFermentable)
            });
        })
        .catch((err) => callback(err));
}

/**
 * Update a fermentable
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function updateFermentable(event, context, callback) {
    console.log(`${process.env.serviceName}: updateFermentable called`);
    let fermentable = JSON.parse(event.body);
    fermentable.id = event.pathParameters.id;

    database.getFermentable(fermentable.id)
        .then((existingFermentable) => {
            fermentable = Object.assign({}, existingFermentable, fermentable);
            // validation
            fermentable = sanitizer.sanitizeModel(fermentable); // get rid of html
            schemaValidator(fermentable, fermentablesSchemaPath); // validate against schema
            return database.updateFermentable(existingFermentable);
        })
        .then((updated) => {
            callback(null, {
                statusCode: statusCodes.OK,
                headers,
                body: JSON.stringify(updated)
            });
        })
        .catch((error) => {
            console.error('updateFermentable: Error(s) validating against schema: ', error);
            callback({
                statusCode: statusCodes.BAD_REQUEST,
                headers,
                body: JSON.stringify({ msg: 'Model failed schema validation.', extended: error.message })
            });
        });
}

/**
 * Delete a fermentable
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function deleteFermentable(event, context, callback) {
    console.log(`${process.env.serviceName}: deleteFermentable called`);
    database.deleteFermentable(event.pathParameters.id)
        .then(() => {
            callback(null, {
                statusCode: statusCodes.NO_CONTENT,
                headers
            });
        })
        .catch((err) => callback(err));
}

module.exports = {
    getFermentable,
    listFermentables,
    createFermentable,
    updateFermentable,
    deleteFermentable
};
