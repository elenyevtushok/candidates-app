# Use Node.js as base image
FROM node:22-slim

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Set working directory to the Angular project folder
WORKDIR /app

# Copy application files
COPY . .

# Install dependencies
RUN npm install

# Build the Angular application
RUN npm run build

# Expose the port your NestJS app runs on
EXPOSE 4200

# Command to run the Angular application
# Adding --host 0.0.0.0 makes the services accessible outside the container
CMD ["ng", "serve", "--host", "0.0.0.0"]
