#!/bin/bash

npm run build
node './version-plus.js'
git add .
git commit -m "$1"
proxychains git push origin master
proxychains npm publish
