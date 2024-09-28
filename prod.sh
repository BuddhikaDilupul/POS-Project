#!/bin/bash

# Set project ID
gcloud config set project pos-kandy

# Deploy the cloud function
gcloud functions deploy kandy-posapplication \
  --runtime nodejs18 \
  --trigger-http \
  --allow-unauthenticated \
  --env-vars-file=env.yaml \
  --service-account=fuel-cloud-func-service-acc@pos-kandy.iam.gserviceaccount.com \
  --docker-registry=artifact-registry \
  --region=us-central1

#gcloud functions deploy dev_sinopec-marawila-fuelapplication --runtime nodejs18  --trigger-http --allow-unauthenticated --env-vars-file=env.yaml --service-account=fuel-cloud-func-service-acc@fuel-system-433004.iam.gserviceaccount.com --docker-registry=artifact-registry  --region=us-central1
#gcloud config set project sinopec-marawila  

# Print status message
if [ $? -eq 0 ]; then
  echo "Deployment succeeded!"
else
  echo "Deployment failed!"
fi
