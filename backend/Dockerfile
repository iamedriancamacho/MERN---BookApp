# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory to /backend
WORKDIR /backend

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Copy the current directory contents into the container at /backend
COPY . .

# Make port 5555 available to the world outside this container
EXPOSE 5555

# Set environment variable for CosmosDB connection string
ENV COSMOSDB_CONNECTION_STRING=mongodb://iamedriancamacho:0InTuODdti8xjCt7th1zCcUC5Yg4mxSskO6H5jic2xcw0DDhZCGuWuP29lp3aQsHfEhvmnBwsbbrACDbqbVo5g%3D%3D@iamedriancamacho.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@iamedriancamacho@

# Run index.js when the container launches
CMD ["node", "index.js"]
