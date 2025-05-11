-- Enable foreign key constraints to ensure referential integrity
PRAGMA foreign_keys = ON;

-- User table: Stores user account information
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    plan TEXT NOT NULL DEFAULT 'free'
);
 

-- Blog posts table: Stores user-generated blog posts about visited countries
CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    country TEXT NOT NULL,
    date_of_visit DATE NOT NULL,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- follower details table 
CREATE TABLE IF NOT EXISTS  follows (
  follower_id INTEGER NOT NULL,
  following_id INTEGER NOT NULL,
  PRIMARY KEY (follower_id, following_id),
  FOREIGN KEY (follower_id) REFERENCES users(id),
  FOREIGN KEY (following_id) REFERENCES users(id)
);

-- likes table 
CREATE TABLE IF NOT EXISTS likes (
  user_id INTEGER NOT NULL,
  post_id INTEGER NOT NULL,
  type TEXT CHECK(type IN ('like', 'dislike')) NOT NULL,
  PRIMARY KEY (user_id, post_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (post_id) REFERENCES blog_posts(id)
);

-- comments table
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  post_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (post_id) REFERENCES blog_posts(id)
);

