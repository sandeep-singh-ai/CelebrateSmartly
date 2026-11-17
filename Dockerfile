
# Use the official Bun image as base
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies into temp directory
# This will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json /temp/dev/
COPY bun.lockb* /temp/dev/
RUN cd /temp/dev && bun install

# Copy node_modules from temp directory
# Then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Build the application
ENV NODE_ENV=production
RUN bun run build

# Final stage - serve the built files
FROM base AS release
COPY --from=prerelease /app/dist dist

# Create a proper server file
RUN echo "const server = Bun.serve({" > server.js && \
    echo "  port: 3000," >> server.js && \
    echo "  hostname: \"0.0.0.0\"," >> server.js && \
    echo "  async fetch(req) {" >> server.js && \
    echo "    const url = new URL(req.url);" >> server.js && \
    echo "    let path = url.pathname === \"/\" ? \"/index.html\" : url.pathname;" >> server.js && \
    echo "    " >> server.js && \
    echo "    try {" >> server.js && \
    echo "      const file = Bun.file(\"./dist\" + path);" >> server.js && \
    echo "      const exists = await file.exists();" >> server.js && \
    echo "      if (exists) {" >> server.js && \
    echo "        return new Response(file);" >> server.js && \
    echo "      } else {" >> server.js && \
    echo "        // Return index.html for SPA routing" >> server.js && \
    echo "        const indexFile = Bun.file(\"./dist/index.html\");" >> server.js && \
    echo "        return new Response(indexFile);" >> server.js && \
    echo "      }" >> server.js && \
    echo "    } catch {" >> server.js && \
    echo "      const indexFile = Bun.file(\"./dist/index.html\");" >> server.js && \
    echo "      return new Response(indexFile);" >> server.js && \
    echo "    }" >> server.js && \
    echo "  }" >> server.js && \
    echo "});" >> server.js && \
    echo "" >> server.js && \
    echo "console.log(\"Server running on http://0.0.0.0:3000\");" >> server.js

# Expose port
EXPOSE 3000

# Set user to non-root
USER bun

# Start the server
CMD ["bun", "server.js"]
