FROM node:12

WORKDIR /app
COPY package*.json ./
RUN yarn global add @quasar/cli
COPY . .

RUN yarn
# expose 5000 on container
EXPOSE 8080

# set app serving to permissive / assigned
#ENV NUXT_HOST=0.0.0.0
# set app port
#ENV NUXT_PORT=8080

# start the app
CMD HOST=0.0.0.0 NETWORK=jungle yarn run dev
