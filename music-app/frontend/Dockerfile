# Use a base image for Node.js
FROM node:14

# Set the working directory
WORKDIR /app

# Copy the frontend code into the Docker image
COPY . .

# Install dependencies
RUN npm install

# Build the frontend using Vite
RUN npm run build

# Expose the necessary port for the frontend service
EXPOSE 3000

# Command to run the frontend service
CMD ["npm", "run", "dev"]
