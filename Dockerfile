FROM ghcr.io/puppeteer/puppeteer:21.5.2

# RUN npm i chromium-browser

# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
#     PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# ENV PUPPETEER_CACHE_DIR=$(pwd) npm install puppeteer
# ENV PUPPETEER_CACHE_DIR=$(pwd) node <script-path>

WORKDIR /usr/src/app


COPY package*.json ./
RUN npm ci
COPY . .
CMD ["node", "index.js"]
