# Build stage
FROM node:18 AS builder

WORKDIR /app
# Copy everything from frontend/
COPY frontend/ . 

#  since context is already frontend/
# COPY . .                      
RUN npm install
# Build Vite/React app (output: /app/dist)
RUN npm run build           

# Serve stage
FROM node:18 AS runner

WORKDIR /app

# Install 'serve' globally to serve static files
RUN npm install -g serve

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Expose port 5173 (or any you like)
EXPOSE 5173

# Start static file server
CMD ["serve", "-s", "dist", "-l", "5173"]
