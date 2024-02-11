# NimbleChatRoom
72-hour Hackthon by Nimble Robotics

**Author: Mengxi Chen**

## Introduction
This is a full-stack application which can realize real-time chat in a public chatting room.

**Front-end** features: (in React.js)
<ul>
    <li>Users can see previous chat history after successfully loggin in. </li>
    <li>To register, username must be unique. </li>
    <li>Users can send message to everyone. </li>
    <li>Each message has a time stamp on it (in UTC time zone). </li>
    <li>Each message has two voting buttons, which allows users to upvote &#8679;/downvote &#8681; on a specific message. </li>
    <li>Voting is also real-time. </li>
</ul>

**Back-end** features: (in Node.js & Express.js)
<ul>
    <li>Server can store users' username and password in database (PostgreSQL). </li>
    <li>Passwords are hashed for higher security. </li>
    <li>Server will accept sign-up requests and login requests. </li>
    <li>Server will check if password entered is correct in login requests and if username already exists in sign-up requests. </li>
    <li>All messages are stored in database. </li>
    <li>Race conditions for voting functionality is handled. </li>
</ul>

## To Run The App
First, create the required tables in your database. Please make sure to update the related information in the `/nimble_chat_room_be/server.js` around line 12.

Then, in `/nimble_chat_room_be`, run `npm install`, then `npm start` to start the server.

Lastly, in `/nimble_chat_room`, run `npm install`, then `npm start` to start the application. The first browser tab should be opened up automatically. To have multiple users logging in, you can open multiple tabs now.