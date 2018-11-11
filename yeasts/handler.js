'use strict';

const statusCodes = require('beerschema-shared/constants').statusCodes;
const schemaValidator = require('beerschema-shared/validation').validateAgainstSchema;
const sanitizer = require('beerschema-shared/sanitizer');
const path = require('path');
const yeastsSchemaPath = path.join(process.cwd(), 'yeasts.schema.json');
const database = require('./database');

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
};

/**
 * Get one yeast
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function getYeast(event, context, callback) {
    console.log(`${process.env.serviceName}: getYeast called`);
    database.getYeast(event.pathParameters.id)
        .then((yeast) => {
            callback(null, {
                statusCode: statusCodes.OK,
                headers,
                body: JSON.stringify(yeast)
            });
        })
        .catch((err) => callback(err));
}

/**
 * Get all yeasts
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function listYeasts(event, context, callback) {
    // TODO: pagination - I think this is how to get headers: https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html#eventsources-api-gateway-request
    // let page = event.headers['x-pagination-page'];
    // let numItems = event.headers[ 'x-pagination-limit'];
    console.log(`${process.env.serviceName}: listYeasts called`);
    database.listYeasts()
        .then((yeasts) => {
            // headers['x-pagination-page'] = ;
            // headers['x-pagination-total-items'] = ;
            callback(null, {
                statusCode: statusCodes.OK,
                headers,
                body: JSON.stringify(yeasts)
            });
        })
        .catch((err) => callback(err));
}

/**
 * Create a yeast
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function createYeast(event, context, callback) {
    console.log(`${process.env.serviceName}: createYeast called`);
    let yeast = JSON.parse(event.body);

    // validation
    try {
        yeast = sanitizer.sanitizeModel(yeast); // get rid of html
        schemaValidator(yeast, yeastsSchemaPath); // validate against schema
    } catch (error) {
        console.error('createYeast: Error(s) validating against schema: ', error);
        callback({
            statusCode: statusCodes.BAD_REQUEST,
            headers,
            body: JSON.stringify({ msg: 'Model failed schema validation.', extended: error.message })
        });
        return;
    }

    database.createYeast(yeast)
        .then((newYeast) => {
            callback(null, {
                statusCode: statusCodes.CREATED,
                headers,
                body: JSON.stringify(newYeast)
            });
        })
        .catch((err) => callback(err));
}

/**
 * Update a yeast
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function updateYeast(event, context, callback) {
    console.log(`${process.env.serviceName}: updateYeast called`);
    let yeast = JSON.parse(event.body);
    yeast.id = event.pathParameters.id;

    database.getYeast(yeast.id)
        .then((existingYeast) => {
            yeast = Object.assign({}, existingYeast, yeast);
            // validation
            yeast = sanitizer.sanitizeModel(yeast); // get rid of html
            schemaValidator(yeast, yeastsSchemaPath); // validate against schema
            return database.updateYeast(existingYeast);
        })
        .then((updated) => {
            callback(null, {
                statusCode: statusCodes.OK,
                headers,
                body: JSON.stringify(updated)
            });
        })
        .catch((error) => {
            console.error('updateYeast: Error(s) validating against schema: ', error);
            callback({
                statusCode: statusCodes.BAD_REQUEST,
                headers,
                body: JSON.stringify({ msg: 'Model failed schema validation.', extended: error.message })
            });
        });
}

/**
 * Delete a yeast
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function deleteYeast(event, context, callback) {
    console.log(`${process.env.serviceName}: deleteYeast called`);
    database.deleteYeast(event.pathParameters.id)
        .then(() => {
            callback(null, {
                statusCode: statusCodes.NO_CONTENT,
                headers
            });
        })
        .catch((err) => callback(err));
}

module.exports = {
    getYeast,
    listYeasts,
    createYeast,
    updateYeast,
    deleteYeast
};
