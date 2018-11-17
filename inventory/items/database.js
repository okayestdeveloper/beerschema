'use strict';

const aws = require('aws-sdk');
const dynamo = new aws.DynamoDB.DocumentClient({ region: process.env.awsRegion });
const tableName = process.env.inventoryItemsTableName;
const uuidv1 = require('uuid/v1');

/**
 * Retrieve on inventory item record by id from Dynamo DB
 * @param {string} id
 * @return {Promise}
 */
function getInventoryItem(id) {
  return dynamo
    .get({
      Key: { id },
      TableName: tableName
    })
    .promise()
    .then((data) => data.Item);
}

/**
 * Get all the inventoryItems limited by pagination
 * TODO: pagination - apparently "Limit start, count" isn't supported in DynamoDB
 * @return {Promise}
 */
function listInventoryItems() {
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
 * Create a inventoryItem
 * @param {object} inventoryItem model instance
 * @return {Promise}
 */
function createInventoryItem(inventoryItem) {
  inventoryItem.id = uuidv1();
  return dynamo
    .put({
      TableName: tableName,
      Item: inventoryItem
    })
    .promise()
    .then(() => inventoryItem); // return what we just inserted
}

/**
 * Update a inventoryItem
 * @param {object} inventoryItem model instance
 * @return {Promise}
 */
function updateInventoryItem(inventoryItem) {
  return dynamo
    .put({
      TableName: tableName,
      Item: inventoryItem // ,
      // ReturnValues: 'ALL_NEW' DynamoDB.PutItem doesn't support ALL_NEW apparently
    })
    .promise()
    .then(() => inventoryItem); // so just send back the updated version
}

/**
 * Delete a inventoryItem
 * @param {string} id
 * @return {Promise}
 */
function deleteInventoryItem(id) {
  return dynamo
    .delete({
      Key: { id },
      TableName: tableName
    })
    .promise();
}

module.exports = {
  getInventoryItem,
  listInventoryItems,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem
};
