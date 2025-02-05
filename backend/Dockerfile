# Use Node.js as base image
FROM node:22

# Set working directory
WORKDIR /app

# Copy application files
COPY . .

# Install dependencies
RUN npm install

# Expose the port your NestJS app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start"]