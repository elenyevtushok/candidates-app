# Use Node.js as base image
FROM node:22-slim

# Set working directory
WORKDIR /app

# Copy application files
COPY . .

# Install dependencies
RUN npm install

# Build the NestJS app
RUN npm run build

# Expose the port your NestJS app runs on
EXPOSE 3000

# Command to run the Angular application
# Adding --host 0.0.0.0 makes the services accessible outside the container
# -- marks the boundary
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0"]