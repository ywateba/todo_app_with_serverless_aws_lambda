
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getTodos } from '../../businessLogic/todo.mjs'
import { getUserId } from '../utils.mjs'

import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('list')

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
      console.info('List Todo', event)
      console.info("listing todooooooooooos")
      // Parse the newTodo from the request body

      try {

        const newTodo = JSON.parse(event.body);

        // Extracting user ID using "getUserId"
        const userId = getUserId(event)


        if(!userId){
          console.info("Not Authorized, userID: ", userId)
          console.info("not Authorized ")
          throw new Error("Not Authoriyed")
        }
        console.info("userId", userId)


        const items = await getTodos(userId)
        console.info("items: ", items)


        const response =  {
          statusCode: 200,
          headers: {
              'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({items})
        }

        console.info("Response", response)
        return response

      } catch (error) {
        console.error("Error occured",error)


        return {
          statusCode: 500,
          headers: {
              'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify(error)
        };

      }

  }
