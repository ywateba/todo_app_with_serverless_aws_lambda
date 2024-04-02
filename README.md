# Todo App

This repository showcases a Todo application with both backend (serverless Node.js Lambda functions) and frontend (React web app) components.

## Backend

The backend of the application is implemented using Node.js and AWS Lambda functions. It provides APIs for managing Todo items, including CRUD operations (Create, Read, Update, Delete).

### Serverless Framework Configuration

The backend is configured and deployed using the Serverless Framework. The `serverless.yml` file in the `backend` folder defines the AWS Lambda functions, API Gateway endpoints, and other resources required by the application. Your need and aws account and eventually an aws profile configured on your machine

To deploy the backend, follow these steps:

1. Navigate to the `backend` folder.
2. Make sure you have the Serverless Framework installed globally (`npm install -g serverless`).
3. Configure your AWS credentials using the AWS CLI (`aws configure`).
4. Run `serverless deploy --aws-profile your_profile` to deploy the backend to AWS.

## Frontend

The frontend of the application is implemented using React.js. It provides a user interface for interacting with the Todo items managed by the backend.


To run the frontend locally, follow these steps:

1. Navigate to the `client` folder.
2. Install dependencies using `npm install`.
3. Start the development server using `npm start`.



## License

This project is licensed under the [MIT License](LICENSE).
