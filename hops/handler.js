'use strict';

const statusCodes = require('beerschema-shared/constants').statusCodes;
const schemaValidator = require('beerschema-shared/validation').validateAgainstSchema;
const sanitizer = require('beerschema-shared/sanitizer');
const path = require('path');
const hopsSchemaPath = path.join(process.cwd(), 'hops.schema.json');
const database = require('./database');

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
};

/**
 * Get one hop
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function getHop(event, context, callback) {
    console.log(`${process.env.serviceName}: getHop called`);
    database.getHop(event.pathParameters.id)
        .then((hop) => {
            callback(null, {
                statusCode: statusCodes.OK,
                headers,
                body: JSON.stringify(hop)
            });
        })
        .catch((err) => callback(err));
}

/**
 * Get all hops
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function listHops(event, context, callback) {
    // TODO: pagination - I think this is how to get headers:
    // https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html#eventsources-api-gateway-request
    // let page = event.headers['x-pagination-page'];
    // let numItems = event.headers[ 'x-pagination-limit'];
    console.log(`${process.env.serviceName}: listHops called`);
    database.listHops()
        .then((hops) => {
            // headers['x-pagination-page'] = ;
            // headers['x-pagination-total-items'] = ;
            callback(null, {
                statusCode: statusCodes.OK,
                headers,
                body: JSON.stringify(hops)
            });
        })
        .catch((err) => callback(err));
}

/**
 * Create a hop
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function createHop(event, context, callback) {
    console.log(`${process.env.serviceName}: createHop called`);
    let hop = JSON.parse(event.body);

    // validation
    try {
        hop = sanitizer.sanitizeModel(hop); // get rid of html
        schemaValidator(hop, hopsSchemaPath); // validate against schema
    } catch (error) {
        console.error('createHop: Error(s) validating against schema: ', error);
        callback({
            statusCode: statusCodes.BAD_REQUEST,
            headers,
            body: JSON.stringify({ msg: 'Model failed schema validation.', extended: error.message })
        });
        return;
    }

    database.createHop(hop)
        .then((newHop) => {
            callback(null, {
                statusCode: statusCodes.CREATED,
                headers,
                body: JSON.stringify(newHop)
            });
        })
        .catch((err) => callback(err));
}

/**
 * Update a hop
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function updateHop(event, context, callback) {
    console.log(`${process.env.serviceName}: updateHop called`);
    let hop = JSON.parse(event.body);
    hop.id = event.pathParameters.id;

    database.getHop(hop.id)
        .then((existingHop) => {
            hop = Object.assign({}, existingHop, hop);
            // validation
            hop = sanitizer.sanitizeModel(hop); // get rid of html
            schemaValidator(hop, hopsSchemaPath); // validate against schema
            return database.updateHop(existingHop);
        })
        .then((updated) => {
            callback(null, {
                statusCode: statusCodes.OK,
                headers,
                body: JSON.stringify(updated)
            });
        })
        .catch((error) => {
            console.error('updateHop: Error(s) validating against schema: ', error);
            callback({
                statusCode: statusCodes.BAD_REQUEST,
                headers,
                body: JSON.stringify({ msg: 'Model failed schema validation.', extended: error.message })
            });
        });
}

/**
 * Delete a hop
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function deleteHop(event, context, callback) {
    console.log(`${process.env.serviceName}: deleteHop called`);
    database.deleteHop(event.pathParameters.id)
        .then(() => {
            callback(null, {
                statusCode: statusCodes.NO_CONTENT,
                headers
            });
        })
        .catch((err) => callback(err));
}

module.exports = {
    getHop,
    listHops,
    createHop,
    updateHop,
    deleteHop
};
