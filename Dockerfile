

FROM openjdk:17-alpine

# # Setup JAVA_HOME -- useful for docker commandline
# ENV JAVA_HOME /usr/lib/jvm/java-17-openjdk-amd64/

# RUN export JAVA_HOME

RUN apk add --update nodejs npm

RUN apk add bash

RUN mkdir -p /frontend/

ARG JAR_FILE=target/*.jar
ARG FRONTEND=frontend
ARG ENTRYPOINTSH=entrypoint.sh

COPY ${JAR_FILE} backend/app.jar
COPY ${FRONTEND} frontend/
COPY ${ENTRYPOINTSH} entrypoint.sh

EXPOSE 8080
EXPOSE 80

WORKDIR "/frontend"
RUN npm ci
RUN npm run build
# RUN nohup bash -c "npm run start" 

WORKDIR "/"


ENTRYPOINT ["sh","./entrypoint.sh"]
