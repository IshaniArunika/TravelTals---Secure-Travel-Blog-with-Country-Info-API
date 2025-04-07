# Use official Node.js image
FROM node:18

# Install SQLite and dependencies required for the sqlite3 package
RUN apt-get update && apt-get install -y \
    sqlite3 \
    libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Expose app port (change if necessary)
EXPOSE 4000

# Start the application
CMD ["node", "app.js"]
