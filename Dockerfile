# Use the official Node.js image from Docker Hub
FROM node:latest

# Set the working directory for your app inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port the app will run on (default for Next.js is 3000)
EXPOSE 3000

# Build the React app for production
RUN npm run build

# Start app
CMD ["npm", "start"]
