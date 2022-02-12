#!/bin/sh


bash -c "java -jar backend/app.jar" &
bash -c "cd frontend && npm run start" &

wait