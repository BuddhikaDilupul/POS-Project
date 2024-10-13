# Use the official Node.js image from the Docker Hub
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code and the .env file to the working directory
COPY . .

# Expose the port on which the app will run
EXPOSE 4040

# Command to run the application
CMD ["node", "./dist/index.js"]
