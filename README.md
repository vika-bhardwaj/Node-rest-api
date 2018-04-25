
Installation Instructions
Follow these instructions to install the app and run it with the mock (in-memory) data services:

Make sure you have the npm and MongoDB installed:

Clone the repository:

https://github.com/vikas-ladher/Node-rest-api.git

Navigate to the Node-rest-api directory :

cd zettabyterestAPI

Install the dependencies

npm install

Run the app in the browser

npm start

API url: http://localhost:3000

Routes for user
==========================

Method	/ Endpoints /	Remarks
GET	/users	Get all users

GET	/users/:id	Get single user

PUT	/users/:id	Update single user

POST	/users	Create user

DELETE	/users/:id	Delete single


User payload: 
{
"userName": "vikas",
  "firstName": "vikas",
  "lastName" : "kumar",
  "email" : "vikas.xyz.com",
  "password" : "vikas"
  }

Routes for picture 
======================
Method	/ Endpoints	/ Remarks
GET	/pictures>   Get all pictures

GET	/ pictures /:id	Get single picture

PUT	/ pictures /:id	Update single picture

POST	/ pictures	Create picture

DELETE	/ pictures /:id	Delete single picture


