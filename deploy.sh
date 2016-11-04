#!/bin/bash
echo "Start deploying"
ember build --environment=production
rsync -azP ./dist/ afeefa@schedar.uberspace.de:/var/www/virtual/afeefa/dev-backend.afeefa.de/
echo "Done"
