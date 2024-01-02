# Happy Backend

Happy Backend serves as the server-side infrastructure for the Happy social media platform. It handles user authentication, post sharing, user profiles, and the news feed.

## Features

1. **User Authentication**: Secure authentication process for users using JWT tokens.
2. **Post Sharing**: Users can share posts in four categories: Happy, Sad, Help, and News.
3. **User Profiles**: CRUD operations for user profiles with personal information.
4. **News Feed**: Display posts in the news feed connected to the authenticated user.
5. **Middleware**: Utilizes bcrypt for password hashing, body-parser for request body parsing, cors for Cross-Origin Resource Sharing, dotenv for environment variables, and multer for handling file uploads.

## Technology Stack

- Node.js
- Express
- MongoDB (via Mongoose)
- bcrypt, body-parser, cors, dotenv, jsonwebtoken for middleware operations.
- Multer for handling file uploads.

## Environment Variables

Make sure to set the following environment variables in your `.env` file:

- `PORT`: Port on which the server will run.
- `MONGODB_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret key for JWT token generation.

## Contributing

Feel free to contribute to the development of Happy Backend. Create a fork, make your changes, and submit a pull request!

## Social Links

Connect with me:

- [GitHub](https://github.com/zamanmonirbu)
- [LinkedIn](www.linkedin.com/in/mdmoniruzzamanbu)
- [Email](mailto:monir.cse6.bu@gmail.com)
