'use strict';

const aws = require('aws-sdk');
const dynamo = new aws.DynamoDB.DocumentClient({ region: process.env.awsRegion });
const tableName = process.env.yeastsTableName;
const uuidv1 = require('uuid/v1');

/**
 * Retrieve on yeast record by id from Dynamo DB
 * @param {string} id
 * @return {Promise}
 */
function getYeast(id) {
    return dynamo
        .get({
            Key: { id },
            TableName: tableName
        })
        .promise()
        .then((data) => data.Item);
}

/**
 * Get all the yeasts limited by pagination
 * TODO: pagination - apparently "Limit start, count" isn't supported in DynamoDB
 * @return {Promise}
 */
function listYeasts() {
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
 * Create a yeast
 * @param {object} yeast model instance
 * @return {Promise}
 */
function createYeast(yeast) {
    yeast.id = uuidv1();
    return dynamo
        .put({
            TableName: tableName,
            Item: yeast
        })
        .promise()
        .then(() => yeast); // return what we just inserted
}

/**
 * Update a yeast
 * @param {object} yeast model instance
 * @return {Promise}
 */
function updateYeast(yeast) {
    return dynamo
        .put({
            TableName: tableName,
            Item: yeast // ,
            // ReturnValues: 'ALL_NEW' DynamoDB.PutItem doesn't support ALL_NEW apparently
        })
        .promise()
        .then(() => yeast); // so just send back the updated version
}

/**
 * Delete a yeast
 * @param {string} id
 * @return {Promise}
 */
function deleteYeast(id) {
    return dynamo
        .delete({
            Key: { id },
            TableName: tableName
        })
        .promise();
}

module.exports = {
    getYeast,
    listYeasts,
    createYeast,
    updateYeast,
    deleteYeast
};
