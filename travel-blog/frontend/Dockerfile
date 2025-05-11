# Use official Node.js image
FROM node

# Set working directory
WORKDIR /app

# Copy the rest of the app's source code
COPY ./build ./build 
RUN npm install -g serve

# Expose app port (change if necessary)
EXPOSE 3001

# Start the application
CMD ["serve", "-s","build"]
