import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core';

const dynamoDb = new DynamoDB()
const dynamoDbXRay = AWSXRay.captureAWSv3Client(dynamoDb)
const dynamoDbClient = DynamoDBDocument.from(dynamoDbXRay)


import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('dynamodb')



const TODO_TABLE = 'Todos-dev' //process.env.TODO_TABLE



// Function to get a TODO item by its ID
export const listItems = async (userId) => {

  console.info("list items")
  console.info("Table:", TODO_TABLE)
  logger.info("Table:", TODO_TABLE)
  const params = {
    TableName: TODO_TABLE,
    FilterExpression: '#userId = :userId',
    ExpressionAttributeNames: {
      '#userId': 'userId'
    },
    ExpressionAttributeValues: {
      ':userId': userId
    }
  };

  try {
    const data = await dynamoDbClient.scan(params);

    //logger.info("Items returned :", data)
    console.info(data.Items)

    return data.Items
  } catch (error) {
    console.info('Error getting todo items:', error);
    throw error;
  }
}





// Function to get a TODO item by its ID
export const getItemById = async (userId,todoId) => {
  console.info("Get  from dynamo dbvitem with id:", todoId)
  const params = {
    TableName: TODO_TABLE,
    Key: {
      userId,
      todoId
    }
  };

  try {
    const { Item } = await dynamoDbClient.get(params);
    return Item;

  } catch (error) {
    console.error('Error getting todo item:', error);
    throw error;
  }
}

// Function to create a new TODO item
export const createItem = async (todoItem) => {
  console.info("create Todo item in dynamo")

  const params = {
    TableName: TODO_TABLE,
    Item: todoItem
  };



  try {
    await dynamoDbClient.put(params)

    console.info("Item created in dynamo:", todoItem)
    return todoItem

  } catch (error) {
    console.error('Error creating todo item:', error);
    throw error;
  }
}

// Function to update an existing TODO item
export const updateItem = async (todoItem) => {
  console.info("update Todo item in dynamo");
  console.info("item to save: ", todoItem);
  const params = {
    TableName: TODO_TABLE,
    Key: {
      userId: todoItem.userId,
      todoId: todoItem.todoId
    },
    UpdateExpression: 'set #name = :name,  done = :done, attachmentUrl = :attachmentUrl',
    ExpressionAttributeNames: {
      '#name': 'name'
    },
    ExpressionAttributeValues: {
      ':name': todoItem.name,
      ':done': todoItem.done,
      ':attachmentUrl': todoItem.attachmentUrl || " "
    }
  };

  // const params = {
  //   TableName: TODO_TABLE,
  //   Item: todoItem
  // };

  try {
    const updated_item = dynamoDbClient.update(params);
    console.info("Updated item :", updated_item)
    return updated_item

  } catch (error) {
    console.error('Error updating todo item:', error);
    throw error;
  }
}

// Function to delete a TODO item by its ID
export const deleteItem = async (userId, todoId) => {
  console.info("delete Todo item in dynamo")
  const params = {
    TableName: TODO_TABLE,
    Key: { userId, todoId }
  };

  try {
    await dynamoDbClient.delete(params);
    return true
  } catch (error) {
    console.error('Error deleting todo item:', error);
    throw error;
  }
}
