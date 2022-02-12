# Theatre Seat picking system

This project is a theatre seat picking system made with Java Spring as the backend and NextJS for its frontend as an entry for the OCBC HACK-IT! Competition.

## Live View

The system's live version can be seen [here](https://peaceful-springs-56939.herokuapp.com/)

## Getting Started

Before running the system, please create a Gmail account for the messaging service for the application. To do this,

### Step 1

Copy the file `application.properties.example` and rename it to `application.properties` within the same directory

### Step 2

provide your email and password to `spring.mail.username` and `spring.mail.password`

Now, you're ready to run the system! You can run the system with and without Docker. both methods are provided below.

### Note

Please be noted that if Gmail does not provide access for this system, go to the Gmail > Manage your Google Account > Security > Less secure app access > Turn on access.

## Run the system without Docker

### Step 1

on the first terminal, run:

```
./mvnw spring-boot:run
```

if you're on Linux or bash

OR

```
mvnw spring-boot:run
```

if you're on Windows

### Step 2

On the second terminal, run:

```
cd frontend
npm i
npm run build
npm run start
```

For a build version

OR

```
cd frontend
npm i
npm run dev
```

For a development version

## Build the System on Docker

In the current file directory,

```
docker build -t springnext/cinematheatre .
docker run -p 3000:3000 springnext/cinematheatre
```
