# Environment Variables Setup Guide

This guide will help you set up all environment variables and fix IDE issues.

## Quick Setup

### 1. Frontend Environment Variables

Create `Frontend/.env.local` file (copy from `.env.example`):

```bash
cd Frontend
copy .env.example .env.local
```

Or manually create `Frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=''
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=''
NEXT_PUBLIC_AUTH0_DOMAIN=''
NEXT_PUBLIC_AUTH0_CLIENT_ID=''
NEXT_PUBLIC_AUTH0_CALLBACK_URL=''
```

### 2. Backend Environment Variables

#### Option A: Use System Environment Variables (Recommended for Production)

Set these environment variables in your system:

**Windows (PowerShell):**
```powershell
$env:SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/citypulse?useSSL=false&serverTimezone=UTC"
$env:SPRING_DATASOURCE_USERNAME="root"
$env:SPRING_DATASOURCE_PASSWORD="your_password"
$env:APP_JWT_SECRET=""
$env:SPRING_MAIL_HOST="smtp.gmail.com"
$env:SPRING_MAIL_PORT="587"
$env:SPRING_MAIL_USERNAME="your_email@gmail.com"
$env:SPRING_MAIL_PASSWORD="your_app_password"
```

**Windows (Command Prompt):**
```cmd
set SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/citypulse?useSSL=false&serverTimezone=UTC
set SPRING_DATASOURCE_USERNAME=root
set SPRING_DATASOURCE_PASSWORD=your_password
set APP_JWT_SECRET=NE55M3gxbFBJckFjWUdxSktWU0Q5OGdXQ2hUanZFZjU=
```

**Linux/Mac:**
```bash
export SPRING_DATASOURCE_URL="jdbc:mysql://localhost:3306/citypulse?useSSL=false&serverTimezone=UTC"
export SPRING_DATASOURCE_USERNAME="root"
export SPRING_DATASOURCE_PASSWORD="your_password"
export APP_JWT_SECRET="NE55M3gxbFBJckFjWUdxSktWU0Q5OGdXQ2hUanZFZjU="
```

#### Option B: Create application-local.properties (Recommended for Development)

1. Copy the example file:
   ```bash
   cd backend/citypulse/src/main/resources
   copy application-local.properties.example application-local.properties
   ```

2. Edit `application-local.properties` and update:
   - Database credentials
   - JWT secret (generate using: `openssl rand -base64 32`)
   - Mail settings (optional for development)

### 3. Generate JWT Secret

**Windows (PowerShell):**
```powershell
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
[System.Convert]::ToBase64String($bytes)
```

**Linux/Mac:**
```bash
openssl rand -base64 32
```

**Online:** Use https://generate-secret.vercel.app/32

### 4. Database Setup

1. Create MySQL database:
   ```sql
   CREATE DATABASE IF NOT EXISTS citypulse;
   ```

2. Update credentials in `application.properties` or environment variables

### 5. Mail Configuration (Optional)

For development, you can:
- **Skip email setup** - The app will work but email notifications will fail gracefully
- **Use Mailtrap** - Free testing SMTP service (https://mailtrap.io)
- **Use Gmail** - Requires App Password (https://support.google.com/accounts/answer/185833)

## IDE Setup

### IntelliJ IDEA

1. **Fix Classpath Issues:**
   - Right-click on `backend/citypulse/pom.xml`
   - Select "Maven" → "Reload Project"
   - Wait for indexing to complete

2. **Set Environment Variables:**
   - Go to Run → Edit Configurations
   - Select your Spring Boot run configuration
   - Add environment variables in "Environment variables" section
   - Or use "VM options": `-DAPP_JWT_SECRET=your_secret_here`

3. **Enable Annotation Processing:**
   - File → Settings → Build, Execution, Deployment → Compiler → Annotation Processors
   - Check "Enable annotation processing"

### Eclipse

1. **Fix Classpath Issues:**
   - Right-click project → Maven → Update Project
   - Check "Force Update of Snapshots/Releases"
   - Click OK

2. **Set Environment Variables:**
   - Right-click project → Run As → Run Configurations
   - Select your Spring Boot App
   - Go to "Environment" tab
   - Add environment variables

### VS Code

1. **Install Extensions:**
   - Java Extension Pack
   - Spring Boot Extension Pack

2. **Fix Classpath Issues:**
   - Open Command Palette (Ctrl+Shift+P)
   - Run "Java: Clean Java Language Server Workspace"
   - Reload window

3. **Set Environment Variables:**
   - Create `.vscode/launch.json`:
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "type": "java",
         "name": "Spring Boot",
         "request": "launch",
         "mainClass": "com.citypulse.citypulse.CitypulseApplication",
         "env": {
           "APP_JWT_SECRET": "your_secret_here",
           "SPRING_DATASOURCE_USERNAME": "root",
           "SPRING_DATASOURCE_PASSWORD": "your_password"
         }
       }
     ]
   }
   ```

## Verification

### Test Backend:
```bash
cd backend/citypulse
mvn spring-boot:run
```

Should start on `http://localhost:8080`

### Test Frontend:
```bash
cd Frontend
npm install
npm run dev
```

Should start on `http://localhost:3000`

## Troubleshooting

### "Cannot find symbol" errors
- Clean and rebuild: `mvn clean install`
- Reload Maven project in IDE
- Check Java version matches pom.xml (Java 21)

### "Classpath" warnings
- Reload Maven project
- Invalidate caches (IntelliJ: File → Invalidate Caches)
- Clean Java Language Server Workspace (VS Code)

### Database connection errors
- Verify MySQL is running
- Check database name and credentials
- Ensure database exists: `CREATE DATABASE citypulse;`

### JWT secret errors
- Ensure `APP_JWT_SECRET` is set or use default in application.properties
- Secret must be base64-encoded and at least 32 bytes

### Email errors
- Email is optional - app will work without it
- Check SMTP credentials if you want email notifications
- MailService catches exceptions gracefully

