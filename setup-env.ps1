# CityPulse Environment Setup Script for Windows PowerShell

Write-Host "=== CityPulse Environment Setup ===" -ForegroundColor Cyan
Write-Host ""

# Create Frontend .env.local
Write-Host "Creating Frontend/.env.local..." -ForegroundColor Yellow
$frontendEnv = @"
NEXT_PUBLIC_API_URL=http://localhost:8081/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBppxRHhRHpnKSJ2VHyaSTftrLZWmJr2ec
NEXT_PUBLIC_AUTH0_DOMAIN=dev-2xgho7dwrynbwitj.us.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=Rgvhiktnu7joCnBxkZsG4ZsO7ZXFewZd
NEXT_PUBLIC_AUTH0_CALLBACK_URL=http://localhost:3000/callback
"@

$frontendEnv | Out-File -FilePath "Frontend\.env.local" -Encoding utf8 -NoNewline
Write-Host "✓ Frontend/.env.local created" -ForegroundColor Green

# Create Backend application-local.properties
Write-Host "Creating backend application-local.properties..." -ForegroundColor Yellow
$backendEnv = @"
# Local Development Configuration
# Update these values with your actual credentials

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/citypulse?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root
spring.jpa.hibernate.ddl-auto=update

# JWT (default secret for development - change in production!)
app.jwt.secret=NE55M3gxbFBJckFjWUdxSktWU0Q5OGdXQ2hUanZFZjU=
app.jwt.expiration-ms=3600000

# Mail (optional - leave empty if not using email)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=
spring.mail.password=
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# Auth0 (already configured)
auth0.domain=dev-2xgho7dwrynbwitj.us.auth0.com
auth0.client-id=Rgvhiktnu7joCnBxkZsG4ZsO7ZXFewZd
auth0.client-secret=UGzfx8QxQAXpU5UdTqo7BXxwo3N3hZfOkpIvD-Y8YflHPe0mSgkGcKhCEa
auth0.callback-url=http://localhost:3000/callback

# CORS
app.cors.allowed-origins=http://localhost:3000
"@

$backendEnv | Out-File -FilePath "backend\citypulse\src\main\resources\application-local.properties" -Encoding utf8 -NoNewline
Write-Host "✓ Backend application-local.properties created" -ForegroundColor Green

Write-Host ""
Write-Host "=== Setup Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Update database credentials in: backend/citypulse/src/main/resources/application-local.properties"
Write-Host "2. (Optional) Update mail settings if you want email notifications"
Write-Host "3. Create MySQL database: CREATE DATABASE citypulse;"
Write-Host "4. In your IDE, reload Maven project to fix classpath issues"
Write-Host ""
Write-Host "For detailed instructions, see SETUP.md" -ForegroundColor Cyan

