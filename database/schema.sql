-- Create database
CREATE DATABASE IF NOT EXISTS mobivisor_db;
USE mobivisor_db;

-- tables
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    isAdmin BOOLEAN NOT NULL DEFAULT 0,
    avatar VARCHAR(255)
);

CREATE TABLE features (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    upvotes INT NOT NULL DEFAULT 0,
    `exists` BOOLEAN NOT NULL DEFAULT 0,
    userId VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL,
    upvotedBy JSON,
    mergedFrom JSON,
    attachments JSON,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE comments (
    id VARCHAR(255) PRIMARY KEY,
    text TEXT NOT NULL,
    featureId VARCHAR(255),
    userId VARCHAR(255) NOT NULL,
    isAdmin BOOLEAN NOT NULL DEFAULT 0,
    createdAt DATETIME NOT NULL,
    FOREIGN KEY (featureId) REFERENCES features(id) ON DELETE SET NULL,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- After setting up the database, you can create an admin account by running this SQL query:
INSERT INTO users (id, name, username, email, password, avatar, isAdmin)
VALUES (
  'admin001', 
  'Admin User', 
  'admin', 
  'admin@mobivisor.com', 
  'securepassword', 
  'https://i.pravatar.cc/150?u=admin@mobivisor.com', 
  1
);