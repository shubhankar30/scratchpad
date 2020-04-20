# We create first temporary container
FROM node:alpine as builder

WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
RUN npm run build

# build folder will have all the files we need to copy

#Copy build files to docker container
# These are bare minimum files necessary for the nginx server

FROM nginx
# check nginx documentation for path information
# copy everything from build folder to nginx server for production env
COPY --from=builder /app/build/ /user/share/nginx/html 