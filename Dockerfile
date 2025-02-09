# Use an official Node.js runtime as the base image
FROM node

# Set the working directory within the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Install PM2 globally
RUN npm install pm2 -g

# Copy the rest of your project files to the container
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port that Next.js will run on (usually 3000)
EXPOSE 3000

# Start the Next.js application using PM2
CMD ["pm2-runtime", "npm", "--", "start", "--", "-p", "3000"]