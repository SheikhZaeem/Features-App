# Mobivisor Feature Request App - README
 
## Overview

Mobivisor is a feature request application built with Vue.js and Express that allows users to submit, vote on, and discuss feature requests. Admins can manage submissions, merge related requests, and mark features as implemented.

## Features of Game

- User authentication (login/registration)
- Feature submission with attachments (images, PDFs, etc.)
- Upvoting features
- Commenting system with admin responses
- Admin capabilities:
- Merge related feature requests
- Mark features as implemented
- Delete any post
- Multi-language support (English, French, German, Turkish, Chinese)
- Responsive design
  
  
## Technology Stack  

- Frontend: Vue 3, Pinia (state management), Vue Router, Vue I18n (internationalization)
- Backend: Node.js, Express.js, MySQL
- Other: Multer (file uploads), CORS, Dotenv


## Setup & Run Locally

### Prerequisites

- Node.js 
- MySQL
- npm 
  
### Install and Run

```bash
# Clone the repo
git clone https://github.com/SheikhZaeem/Features-App
cd MV_Feature_App

# Install dependencies
npm install

# Set up MySQL database
Create a new MySQL database and user with appropriate privileges. And then create
the tables as in folder database/schema.sql 
Create an admin account after setting up databse as shown in database/schema.sql 

# Create a .env file in the project root with your database credentials:
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=mobivisor_db
PORT=4000

```
## Running the Application

```bash
# Start the backend server
node server.js

# Start the frontend development server
npm run dev
```

## Application Structure

```bash
├── src/
│   ├── assets/              
│   ├── components/           
│   │   ├── AppHeader.vue
│   │   ├── CommentSection.vue
│   │   └── FeatureCard.vue
│   ├── services/           
│   │   └── auth.js     
│   ├── locales/
│   │   ├── de.json
│   │   ├── en.json
│   │   ├── fr.json
│   │   ├── tr.json  
│   │   └── zh.json 
│   ├── stores/               
│   │   └── featureStore.js   
│   ├── views/                
│   │   ├── AddFeatureView.vue
│   │   ├── HomeView.vue
│   │   ├── LoginView.vue
│   │   └── RegisterView.vue
│   ├── router.js/      
│   │   ├── authGuard.js
│   │   └── index.js
│   ├── i18n.js
│   ├── App.vue
│   └── main.js               
├── server.js                 # Express backend server
├── package.json 
├── index.html  
├── attachments          
└── .env                      
```


