
// import middy from '@middy/core'
// import cors from '@middy/http-cors'
// import httpErrorHandler from '@middy/http-error-handler'
import { getTodos } from '../../businessLogic/todo.mjs'
import { getUserId } from '../utils.mjs'

import { createLogger ,attachLoggerMiddleware} from '../../utils/logger.mjs'

const logger = createLogger('aws/lambda/getTodos')


const lambdahandler = async (event, context) => {
      // Write your logic here
      console.info("event", event)
      context.logger.info('Get Todos', event)

      // Parse the newTodo from the request body

      try {

        const newTodo = JSON.parse(event.body);

        // Extracting user ID using "getUserId"
        const userId = getUserId(event)


        if(!userId){
          context.logger.info("Not Authorized, userID: ", userId)

          throw new Error("Not Authorized")
        }
        context.logger.info("userId", userId)


        const items = await getTodos(userId, context)
        context.logger.info("items: ", items)


        const response =  {
          statusCode: 200,
          headers: {
              'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({items})
        }

        context.logger.info("Response", response)
        return response

      } catch (error) {
        context.logger.error("Error occured",error)


        return {
          statusCode: 500,
          headers: {
              'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify(error)
        };

      }

  }


export const handler = attachLoggerMiddleware(lambdahandler, logger)