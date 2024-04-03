
// import middy from '@middy/core'
// import cors from '@middy/http-cors'
// import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { updateTodo } from '../../businessLogic/todo.mjs'

import { createLogger ,attachLoggerMiddleware} from '../../utils/logger.mjs'

const logger = createLogger('aws/lambda/updateTodo')


const lambdahandler = async (event,context) => {

  context.logger.info( "Process create Todo event", { event })
  try {


    // Parse the newTodo from the request body
    const todoId = event.pathParameters.todoId
    const newTodo = JSON.parse(event.body);

    context.logger.info("updated todo:", newTodo)

    if (newTodo.hasOwnProperty('attachmentUrl')) {
      if (newTodo.attachmenturl != null | newTodo.attachmenturl != "") {
        newTodo.attachmenturl = " "
      }
    }

    context.logger.info("updated todo with attachment url :", newTodo)

    // Extracting user ID using "getUserId"
    const userId = getUserId(event)

    // Construct the todoItem object
    const todoItem = {
      todoId,
      userId,
      ...newTodo
    };

    context.logger.info("Updated todo to save:", todoItem)

    const item = await updateTodo(todoItem, context)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ item })
    };
  } catch (error) {

    context.logger.error("Some error Occured:", {error})
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error })
    };

  }
}

export const handler = attachLoggerMiddleware(lambdahandler, logger)
