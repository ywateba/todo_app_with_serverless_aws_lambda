// import middy from '@middy/core'
// import cors from '@middy/http-cors'
// import httpErrorHandler from '@middy/http-error-handler'
import { deleteTodo } from '../../businessLogic/todo.mjs'
import { getUserId } from '../utils.mjs'

import { createLogger ,attachLoggerMiddleware} from '../../utils/logger.mjs'

const logger = createLogger('/aws/lambda/deleteTodo')

const lambdahandler = async (event, context) => {

    context.logger.info( "Process delete Todo event", { event })
      try {
          const todoId = event.pathParameters.todoId
          context.logger.info('Delete Todo id ', {todoId})
          const userId = getUserId(event)
          if (!userId){
              context.logger.info("No user id")
          }

          const success = await deleteTodo(userId,todoId, context);

          if (success){
              context.logger.info("Todo Item deleted")
              return {
                statusCode: 200,
                headers: {
                  'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({status: "success"})
              }

          } else {
            context.logger.error("Error")
          }
      } catch (error) {
        context.logger.error( "Todo item deletion error ", { error})
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify({error})
        }

      }
  }

  export const handler = attachLoggerMiddleware(lambdahandler, logger)
