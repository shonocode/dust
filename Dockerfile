# D.U.S.T is a client-side SPA (react-router ssr:false): the build outputs
# static files only, so production serving is plain nginx.
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# optional: bake in a crime-stats API key (see .env.example)
ARG VITE_DATA_GOV_API_KEY=
ENV VITE_DATA_GOV_API_KEY=$VITE_DATA_GOV_API_KEY
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build/client /usr/share/nginx/html
EXPOSE 80
