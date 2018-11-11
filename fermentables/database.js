'use strict';

const aws = require('aws-sdk');
const dynamo = new aws.DynamoDB.DocumentClient({ region: process.env.awsRegion });
const tableName = process.env.fermentablesTableName;
const uuidv1 = require('uuid/v1');

/**
 * Retrieve on fermentable record by id from Dynamo DB
 * @param {string} id
 * @return {Promise}
 */
function getFermentable(id) {
    return dynamo
        .get({
            Key: { id },
            TableName: tableName
        })
        .promise()
        .then((data) => data.Item);
}

/**
 * Get all the fermentables limited by pagination
 * TODO: pagination - apparently "Limit start, count" isn't supported in DynamoDB
 * @return {Promise}
 */
function listFermentables() {
    return dynamo
        .scan({
            TableName: tableName
        })
        .promise()
        .then((data) => data.Items || []);
    //     .query({
    //     TableName: tableName,
    //     ScanIndexForward: true,
    //     Limit: numItems,
    //     ExclusiveStartKey: {
    //         'label': ???
    //     }
    // })
}

/**
 * Create a fermentable
 * @param {object} fermentable model instance
 * @return {Promise}
 */
function createFermentable(fermentable) {
    fermentable.id = uuidv1();
    return dynamo
        .put({
            TableName: tableName,
            Item: fermentable
        })
        .promise()
        .then(() => fermentable); // return what we just inserted
}

/**
 * Update a fermentable
 * @param {object} fermentable model instance
 * @return {Promise}
 */
function updateFermentable(fermentable) {
    return dynamo
        .put({
            TableName: tableName,
            Item: fermentable // ,
            // ReturnValues: 'ALL_NEW' DynamoDB.PutItem doesn't support ALL_NEW apparently
        })
        .promise()
        .then(() => fermentable); // so just send back the updated version
}

/**
 * Delete a fermentable
 * @param {string} id
 * @return {Promise}
 */
function deleteFermentable(id) {
    return dynamo
        .delete({
            Key: { id },
            TableName: tableName
        })
        .promise();
}

module.exports = {
    getFermentable,
    listFermentables,
    createFermentable,
    updateFermentable,
    deleteFermentable
};
