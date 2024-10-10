npm run build
# Pre-start npm script (optional; make sure this is intended)
npm run swagger-autogen

# Remove old swagger output
Remove-Item "D:\All projects\POS\pos - kandy\dist\swagger-output.json" -ErrorAction SilentlyContinue

# Copy new swagger output
Copy-Item "D:\All projects\POS\pos - kandy\swagger-output.json" "D:\All projects\POS\pos - kandy\dist\"

# Set Google Cloud project ID
gcloud config set project pos-kandy

# Deploy the cloud function
$deployResult = gcloud functions deploy kandy-posapplication `
  --runtime nodejs18 `
  --trigger-http `
  --allow-unauthenticated `
  --env-vars-file=env.yaml `
  --service-account=fuel-cloud-func-service-acc@pos-kandy.iam.gserviceaccount.com `
  --docker-registry=artifact-registry `
  --region=us-central1

# Print deployment status message
if ($LASTEXITCODE -eq 0) {
    Write-Host "Deployment succeeded!"
} else {
    Write-Host "Deployment failed!"
}
