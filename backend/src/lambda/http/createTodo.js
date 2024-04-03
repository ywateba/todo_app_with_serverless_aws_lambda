
// import middy from '@middy/core'
// import cors from '@middy/http-cors'
// import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { createTodo } from '../../businessLogic/todo.mjs'
import { createLogger, attachLoggerMiddleware } from '../../utils/logger.mjs'
import { v4 as uuidv4 } from 'uuid';

const logger = createLogger('aws/lambda/createTodo')


const lambdahandler = async (event, context) => {
  console.log("here is the context", context)
  console.info("event", event)


  context.logger.info( "Process create Todo event", { event })

  try {
    // Parse the newTodo from the request body
    const newTodo = JSON.parse(event.body);
    // Extracting user ID using "getUserId"
    const userId = getUserId(event)

     // Generate a unique ID for the todo item
     const todoId = uuidv4();



    context.logger.info('Create Todo Item', { item: newTodo, userId: userId, todoId: todoId})


    const attachmentUrl = " "

    // Current timestamp for createdAt
    const createdAt = new Date().toISOString();
    const done = false

    // Construct the todoItem object
    const todoItem = {
      todoId,
      createdAt,
      userId,
      done,
      attachmentUrl,
      ...newTodo
    };

    context.logger.info('Todo item to save :', {todoItem})

    const item = await createTodo(todoItem, context)

    context.logger.info('Sending Response  :', {item})

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({item})
    };
  } catch (error) {

    context.logger.error("Error for Todo Creation", {error})
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({error})
    };

  }
}

export const handler = attachLoggerMiddleware(lambdahandler, logger)
