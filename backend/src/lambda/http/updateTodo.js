
// import middy from '@middy/core'
// import cors from '@middy/http-cors'
// import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { updateTodo } from '../../businessLogic/todo.mjs'

import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('update')

// export const handler = middy()
//   .use(httpErrorHandler())
//   .use(
//     cors({
//       credentials: true,
//       headers: {
//         'Access-Control-Allow-Origin': '*'
//       },
//       origin: "*"
//     })
//   )
export const handler = async (event) => {
  try {
    // Write your logic here

    // Parse the newTodo from the request body
    const todoId = event.pathParameters.todoId
    const newTodo = JSON.parse(event.body);

    console.info("updated todo:", newTodo)

    if (newTodo.hasOwnProperty('attachmentUrl')){
      if (newTodo.attachmenturl != null | newTodo.attachmenturl != ""){
        newTodo.attachmenturl = " "
      }
    }

    console.info("updated todo with attachment url :", newTodo)

    // Extracting user ID using "getUserId"
    const userId = getUserId(event)

    // Construct the todoItem object
    const todoItem = {
      todoId,
      userId,
      ...newTodo
    };

    console.info("Updated todo to save:", todoItem)

    const item = await updateTodo(todoItem)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ item })
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error })
    };

  }
}
