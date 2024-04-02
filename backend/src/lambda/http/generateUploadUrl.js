import AWSXRay from 'aws-xray-sdk-core';
// import middy from '@middy/core';
// import cors from '@middy/http-cors';
// import httpErrorHandler from '@middy/http-error-handler';
import { getUserId } from '../utils.mjs';
import { generateUploadUrl,getTodo, updateTodo } from "../../businessLogic/todo.mjs";
import { createLogger } from '../../utils/logger.mjs';
const logger = createLogger('s3-url')




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
//   .
export const  handler = async (event) => {

    const segment = AWSXRay.getSegment();
    const subsegment = segment.addNewSubsegment('getPreSignedurl');

    console.info('Create S3 Url', { event: event })
    const todoId = event.pathParameters.todoId
    try {

      // Extracting user ID using "getUserId"
      const userId = getUserId(event)

      const old_todo = await  getTodo(userId,todoId)


      const uploadUrl = await generateUploadUrl(todoId+".jpeg");

      old_todo.attachmentUrl = uploadUrl.split("?")[0]

      await updateTodo(old_todo)

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
      console.error('Error handling Lambda event:', error);
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
