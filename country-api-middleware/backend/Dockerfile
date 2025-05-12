# Use official Node.js image
FROM node

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app's source code
COPY ./src ./src 
COPY ./app.js .
COPY ./countriesV3.1.json .


# Expose app port (change if necessary)
EXPOSE 49100

# Start the application
CMD ["npm", "start"]
