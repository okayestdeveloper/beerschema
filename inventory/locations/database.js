'use strict';

const aws = require('aws-sdk');
const dynamo = new aws.DynamoDB.DocumentClient({ region: process.env.awsRegion });
const tableName = process.env.inventoryLocationsTableName;
const uuidv1 = require('uuid/v1');

/**
 * Retrieve on location record by id from Dynamo DB
 * @param {string} id
 * @return {Promise}
 */
function getLocation(id) {
  return dynamo
    .get({
      Key: { id },
      TableName: tableName
    })
    .promise()
    .then((data) => data.Item);
}

/**
 * Get all the locations limited by pagination
 * TODO: pagination - apparently "Limit start, count" isn't supported in DynamoDB
 * @return {Promise}
 */
function listLocations() {
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
 * Create a location
 * @param {object} location model instance
 * @return {Promise}
 */
function createLocation(location) {
  location.id = uuidv1();
  return dynamo
    .put({
      TableName: tableName,
      Item: location
    })
    .promise()
    .then(() => location); // return what we just inserted
}

/**
 * Update a location
 * @param {object} location model instance
 * @return {Promise}
 */
function updateLocation(location) {
  return dynamo
    .put({
      TableName: tableName,
      Item: location // ,
      // ReturnValues: 'ALL_NEW' DynamoDB.PutItem doesn't support ALL_NEW apparently
    })
    .promise()
    .then(() => location); // so just send back the updated version
}

/**
 * Delete a location
 * @param {string} id
 * @return {Promise}
 */
function deleteLocation(id) {
  return dynamo
    .delete({
      Key: { id },
      TableName: tableName
    })
    .promise();
}

module.exports = {
  getLocation,
  listLocations,
  createLocation,
  updateLocation,
  deleteLocation
};
