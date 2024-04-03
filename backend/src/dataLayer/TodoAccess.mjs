import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core';

const dynamoDb = new DynamoDB()
const dynamoDbXRay = AWSXRay.captureAWSv3Client(dynamoDb)
const dynamoDbClient = DynamoDBDocument.from(dynamoDbXRay)



const TODO_TABLE = 'Todos-dev' //process.env.TODO_TABLE



// Function to get a TODO item by its ID
export const listItems = async (userId, context) => {

  context.logger.info("List items for user; ", {userId})

  const params = {
    TableName: TODO_TABLE,
    KeyConditionExpression: '#userId = :userId',
    ExpressionAttributeNames: {
      '#userId': 'userId'
    },
    ExpressionAttributeValues: {
      ':userId': userId
    }
  };
  context.logger.info("Params for request", {params})

  try {
    const data = await dynamoDbClient.query(params);
    const items = data.Items

    context.logger.info("Items retrived from dynamo db",{items})

    return items

  } catch (error) {
    context.logger.info('Error getting todo items:', error);
    throw error;
  }
}





// Function to get a TODO item by its ID
export const getItemById = async (userId,todoId,context) => {
  context.logger.info("Get  from dynamo dbvitem with id:", todoId)
  const params = {
    TableName: TODO_TABLE,
    Key: {
      userId,
      todoId
    }
  };

  context.logger.info("Params for request", {params})

  try {

    context.logger.info("Make request to dynamodb")
    const { Item } = await dynamoDbClient.get(params);

    context.logger.info("Item got from dynamo:", {Item})
    return Item;

  } catch (error) {
    context.logger.error('Error getting todo item:', error);
    throw error;
  }
}

// Function to create a new TODO item
export const createItem = async (todoItem, context) => {
  context.logger.info("create Todo item in dynamo")

  const params = {
    TableName: TODO_TABLE,
    Item: todoItem
  };

  context.logger.info("Params for request", {params})



  try {

    context.logger.info("Make request to dynamodb")

    await dynamoDbClient.put(params)

    context.logger.info("Item created in dynamo:", todoItem)
    return todoItem

  } catch (error) {
    context.logger.error('Error creating todo item:', error);
    throw error;
  }
}

// Function to update an existing TODO item
export const updateItem = async (todoItem, context) => {
  context.logger.info("update Todo item in dynamo");
  context.logger.info("item to save: ", todoItem);
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

  context.logger.info("Params for request", {params})


  try {
    context.logger.info("Make request to dynamodb")
    const updated_item = dynamoDbClient.update(params);
    context.logger.info("Updated item :", updated_item)
    return updated_item

  } catch (error) {
    context.logger.error('Error updating todo item:', error);
    throw error;
  }
}

// Function to delete a TODO item by its ID
export const deleteItem = async (userId, todoId, context) => {
  context.logger.info("delete Todo item in dynamo")
  const params = {
    TableName: TODO_TABLE,
    Key: { userId, todoId }
  };
  context.logger.info("Params for request", {params})

  try {
    context.logger.info("Make request to dynamodb")
    await dynamoDbClient.delete(params);
    return true
  } catch (error) {
    context.logger.error('Error deleting todo item:', error);
    throw error;
  }
}
