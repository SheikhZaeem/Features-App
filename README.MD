# Mobivisor Feature Request App - README
 
## Overview

A full-stack application for submitting, tracking, and managing feature requests. Users can submit ideas, vote on features, and collaborate through comments. Admins can prioritize, merge requests, and track implementation status.

## Key Features

### User Features
- 🔐 Secure authentication (login/registration)
- 📝 Submit feature requests with attachments
- 👍 Upvote/downvote feature suggestions
- 💬 Comment and discuss feature implementations

### Admin Capabilities
- 🔄 Merge related feature requests
- ✅ Mark features as implemented
- 🗑️ Moderate/delete submissions

### Technical Highlights
- 🌐 Multi-language support (English, French, German, Turkish, Chinese)
- 📱 Fully responsive design
- 📎 File attachment handling
- ⚡ Real-time updates
  
## Technology Stack  

- Frontend: Vue 3, Pinia (state management), Vue Router, Vue I18n (internationalization)
- Backend: Node.js, Express.js, MySQL, Multer

## Setup & Run Locally

### Prerequisites

- Node.js v18+
- MySQL 8.0+
- npm 9+
  
### Install and Run

1. Clone the repo
```bash 
git clone https://github.com/SheikhZaeem/Features-App
cd MV_Feature_App
```

2. Install dependencies
```bash 
npm install
```

3. Set up MySQL database
Create a new MySQL database and user with appropriate privileges as shown in folder database/schema.sql 

4. Create a .env file in the project root with your database credentials:
```bash 
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=mobivisor_db
PORT=4000
```

## Running the Application

1. Start the backend server
```bash
node server.js
```

2. Start the frontend development server
```bash
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


