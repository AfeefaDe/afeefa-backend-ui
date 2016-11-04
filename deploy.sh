#!/bin/bash
echo "Start deploying"
ember build --environment=production
rsync -azP ./dist/ afeefa@schedar.uberspace.de:/home/afeefa/html/backend.afeefa.de
echo "Done"
