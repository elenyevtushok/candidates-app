# Use Node.js as base image
FROM node:22

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy to the root of the container
COPY . /  

# Copy application files
COPY . .

# Install dependencies
RUN npm install

# Expose the port your NestJS app runs on
EXPOSE 4200

# Command to run the Angular application
CMD ["ng", "serve"]