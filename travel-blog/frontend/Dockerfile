# Use official Node.js image
FROM node

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app's source code
COPY ./public ./public 
COPY ./src ./src 

# Expose app port (change if necessary)
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
