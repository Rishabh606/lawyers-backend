# Template for Production Level Node Express Firestore app 
    This application is a template for Node Express Firestore app with Winston Logging, Morgan, Basic Routing and Error Handling. Please change the morgan to custom if you really run in production.

##  Steps to install in CLI
-   run "npm install"
## Steps to run as container in GCP
    Run following commands
-   docker build -t repository-name .
-   docker tag repository-name gcr.io/{PROJECT_ID}/repository-name
-   docker push gcr.io/{PROJECT_ID}/repository-name

## Uninstall Firestore
    You can use this same code even if you don't want to use the firestore. 
-   delete firestore-config.js in config folder
-   npm uninstall firestore-admin --save

## Author: Rishabh Gupta
