import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { deleteTodo } from '../../businessLogic/todo.mjs'
import { getUserId } from '../utils.mjs'

import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('delete')

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
          const todoId = event.pathParameters.todoId
          console.info('Delete Todo id ', todoId)
          const userId = getUserId(event)
          if (!userId){
              console.log("no user id")
          }

          const success = await deleteTodo(userId,todoId);



          if (success){
              console.info("Success")
              return {
                statusCode: 200,
                headers: {
                  'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({status: "success"})
              }

          } else {
            console.error("Error")
          }
      } catch (error) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({error})
        }

      }
  }
