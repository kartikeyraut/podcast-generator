# Use the official Node.js image from the Docker Hub
FROM node:20.18.1

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY feed.js ./

# Copy the entryPoint.sh script to the container
COPY entryPoint.sh /entryPoint.sh

# Ensure the entryPoint.sh script is executable
RUN chmod +x /entryPoint.sh

# Set the default command to execute the entryPoint.sh script
ENTRYPOINT ["/entryPoint.sh"]


# RUN apt-get update && apt-get install -y \
#     python3.10 \
#     python3-pip \
#     git

# RUN pip3 install PyYAML

# COPY feed.py /usr/bin/feed.py

# COPY entryPoint.sh /entryPoint.sh 

# ENTRYPOINT ["/entrypoint.sh"]