# Use the official Node.js image.
FROM node:14

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy the rest of the application code to the container.
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Run the web service on container startup.
CMD ["npm", "start"]
