# VULNERABILITY: Using old base image with known CVEs
FROM node:14.15.0

WORKDIR /app

# VULNERABILITY: Running as root
COPY package*.json ./

RUN npm install

COPY . .

# VULNERABILITY: Exposing unnecessary ports
EXPOSE 3000 22 8080

# VULNERABILITY: Running as root user (no USER directive)
CMD ["npm", "start"]
