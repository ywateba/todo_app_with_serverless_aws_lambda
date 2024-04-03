import AWSXRay from 'aws-xray-sdk-core';

import { getUserId } from '../utils.mjs';
import { generateUploadUrl, getTodo, updateTodo } from "../../businessLogic/todo.mjs";
import { createLogger,attachLoggerMiddleware } from '../../utils/logger.mjs';


const logger = createLogger('/aws/s3/url')


const lambdahandler = async (event, context) => {


  context.logger.info('Request for  S3 PreSignedUrl', { event: event })

  const segment = AWSXRay.getSegment();
  const subsegment = segment.addNewSubsegment('/aws/s3/url');
  const todoId = event.pathParameters.todoId
  // Extracting user ID using "getUserId"
  const userId = getUserId(event)

  try {


    context.logger.info('Request to retrieve old todo item', { userId: userId, todoId: todoId })

    const old_todo = await getTodo(userId, todoId,context)




    context.logger.info('Request Upload Url')

    const uploadUrl = await generateUploadUrl(todoId + ".jpeg",context);

    context.logger.info('Generated Upload Url', { uploadUrl })

    const attachmentUrl = uploadUrl.split("?")[0]


    context.logger.info('Attachement Url', { attachmentUrl })

    old_todo.attachmentUrl = attachmentUrl


    context.logger.info('Update Item with attachemment url')

    await updateTodo(old_todo, context)

    context.logger.info('Item  updatedwith attachemment url')

    // End the subsegment
    subsegment.close();

    // Return the presigned URL in the response
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ uploadUrl })
    };
  } catch (error) {
      context.logger.error('Error with attachment url :', {error});
      // End the subsegment with an error
      subsegment.addError(error);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Failed to process event' })
      };
  } finally {
      // Close the segment
      segment.close();
  }
}

export const handler = attachLoggerMiddleware(lambdahandler, logger)
