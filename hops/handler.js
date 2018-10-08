'use strict';
const aws = require('aws-sdk');
const dynamo = new aws.DynamoDB.DocumentClient({ region: process.env.awsRegion });
const tableName = process.env.productTableName;
const statusCodes = require('../common/constants.js').statusCodes;
const schemaValidator = require('../common/validation').validateAgainstSchema;
const sanitizer = require('../common/sanitizer');

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
    console.log('beer.json - hops - getHop called');
    const id = parseInt(event.pathParameters.id, 10);
    dynamo.get({
        Key: { id },
        TableName: tableName
    }, (err, data) => {
        if (err) {
            callback(err);
        } else {
            const hop = data.Item;
            callback(null, {
                statusCode: statusCodes.OK,
                headers,
                body: JSON.stringify(hop)
            });
        }
    });
}

/**
 * Get one or all hops
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function listHops(event, context, callback) {
    console.log('beer.json - hops - listHops called');
    // TODO: pagination
    dynamo.scan({
        TableName: tableName
    }, (err, data) => {
        if (err) {
            callback(err);
        } else {
            const hops = data.Items;
            callback(null, {
                statusCode: statusCodes.OK,
                headers,
                body: JSON.stringify(hops)
            });
        }
    });
}

/**
 * Create a hop
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function createHop(event, context, callback) {
    console.log('beer.json - hops - createHop called');
    const hop = JSON.parse(event.body);

    // validation
    try {
        hop = sanitizer.sanitizeModel(hop); // get rid of html
        schemaValidator(hop, './hops.schema.json'); // validate against schema
    } catch (error) {
        console.error('createHop: Error(s) validating against schema: ', error);
        callback({
            statusCode: statusCodes.BAD_REQUEST,
            headers,
            body: JSON.stringify({msg: 'Model failed schema validation.', extended: error.message})
        });
    }

    dynamo.put({
        Item: hop,
        TableName: tableName
    }, (err, response) => {
        if (err) {
            callback(err);
        } else {
            callback(null, {
                statusCode: statusCodes.CREATED,
                headers,
                body: JSON.stringify(response)
            });
        }
    });
}

/**
 * Update a hop
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function updateHop(event, context, callback) {
    console.log('beer.json - hops - updateHop called');
    // const hop = JSON.parse(event.body);
    // TODO: validation
}

/**
 * Delete a hop
 * @param {object} event the incoming triggering event. Contains query params and such.
 * @param {object} context execution context, I guess
 * @param {function} callback call to return error or success response
 */
function deleteHop(event, context, callback) {
    console.log('beer.json - hops - deleteHop called');
}

module.exports = {
    getHop,
    listHops,
    createHop,
    updateHop,
    deleteHop
};
