Quick introduction to Alvagram:

Alvagram is a Web App inspired directly by Instagram, includes different actions:

- Register
- Login
- Create a Post
- Follow/Unfollow a user
- Like a Post
- Comment a Post
- Real-time chat using Socket.io

Backend is developed using NodeJs/Express
Frontend is developed using ReactJs

App is responsive, some changes had to be done when deploying it in the actual server.
URL to the app: https://alvagram.net or https://www.alvagram.net

Frontend includes:
- Protected routes
- Role based protected routes
- Persist login
- JWT authentication, NOT stored in Localstorage
- Local storage is only used for persistent login (If user trusts device or not)
