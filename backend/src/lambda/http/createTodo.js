
// import middy from '@middy/core'
// import cors from '@middy/http-cors'
// import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { createTodo } from '../../businessLogic/todo.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { v4 as uuidv4 } from 'uuid';

const logger = createLogger('create')

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
  // Write your logic here

  try {
    // Parse the newTodo from the request body
    const newTodo = JSON.parse(event.body);
    console.info('Create Todo', newTodo)

    // Extracting user ID using "getUserId"
    const userId = getUserId(event)

    console.info('UserId :', userId)

    // Generate a unique ID for the todo item
    const todoId = uuidv4();

    console.info('TodoId', todoId)

    const attachmentUrl = ""

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

    console.info('Todo item to save :', todoItem)

    const item = await createTodo(todoItem)
    console.info('Todo item created :', item)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({item})
    };
  } catch (error) {

    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({error})
    };

  }
}
