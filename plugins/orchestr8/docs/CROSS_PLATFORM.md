# Cross-Platform Compatibility Guide

This guide ensures all agents work seamlessly across macOS, Linux, and Windows.

## Core Principles

1. **Docker First**: Prefer Docker/Docker Compose for all infrastructure
2. **Language Package Managers**: Use npm, pip, go get (cross-platform)
3. **OS Detection**: Detect OS and use appropriate commands when native install needed
4. **Path Handling**: Use forward slashes (work everywhere) or path libraries
5. **Shell Agnostic**: Provide bash and PowerShell alternatives

---

## OS Detection

### Node.js/TypeScript

```typescript
import os from 'os';

const platform = os.platform();
// 'darwin' = macOS, 'linux' = Linux, 'win32' = Windows

function getInstallCommand(package: string): string {
  switch (platform) {
    case 'darwin':
      return `brew install ${package}`;
    case 'linux':
      return `sudo apt-get install -y ${package}`;
    case 'win32':
      return `choco install -y ${package}`;
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

// Better: Use Docker
function getDockerCommand(service: string): string {
  return `docker run -d ${service}`;  // Works everywhere
}
```

### Python

```python
import platform
import sys

def get_os():
    """Detect operating system"""
    system = platform.system()
    # 'Darwin' = macOS, 'Linux' = Linux, 'Windows' = Windows
    return system

def get_install_command(package: str) -> str:
    """Get OS-specific install command"""
    system = get_os()

    if system == 'Darwin':
        return f'brew install {package}'
    elif system == 'Linux':
        # Detect Linux distro
        if 'ubuntu' in platform.version().lower() or 'debian' in platform.version().lower():
            return f'sudo apt-get install -y {package}'
        elif 'fedora' in platform.version().lower() or 'rhel' in platform.version().lower():
            return f'sudo dnf install -y {package}'
        else:
            return f'# Install {package} using your package manager'
    elif system == 'Windows':
        return f'choco install -y {package}'
    else:
        raise ValueError(f'Unsupported OS: {system}')

# Better: Use Docker
def get_docker_command(service: str) -> str:
    """Docker works everywhere"""
    return f'docker run -d {service}'
```

### Bash Script

```bash
#!/bin/bash

# Detect OS
detect_os() {
    case "$OSTYPE" in
        darwin*)  echo "macos" ;;
        linux*)   echo "linux" ;;
        msys*|cygwin*) echo "windows" ;;
        *)        echo "unknown" ;;
    esac
}

# Install package based on OS
install_package() {
    local package=$1
    local os=$(detect_os)

    case $os in
        macos)
            brew install "$package"
            ;;
        linux)
            if command -v apt-get &> /dev/null; then
                sudo apt-get install -y "$package"
            elif command -v dnf &> /dev/null; then
                sudo dnf install -y "$package"
            elif command -v yum &> /dev/null; then
                sudo yum install -y "$package"
            else
                echo "Unknown package manager"
                exit 1
            fi
            ;;
        windows)
            choco install -y "$package"
            ;;
        *)
            echo "Unsupported OS: $os"
            exit 1
            ;;
    esac
}
```

---

## Installation Methods (Preference Order)

### 1. Docker/Docker Compose (PREFERRED)

**Works on:** macOS, Linux, Windows

```yaml
# docker-compose.yml - Works everywhere!
version: '3.8'

services:
  postgres:
    image: postgres:16
    ports:
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password

volumes:
  postgres_data:
```

**Usage:**
```bash
# All platforms (with Docker Desktop installed)
docker-compose up -d
```

### 2. Language Package Managers (CROSS-PLATFORM)

**npm/pnpm/yarn** (Node.js):
```bash
# Works on all platforms
npm install <package>
pnpm add <package>
yarn add <package>
```

**pip/poetry** (Python):
```bash
# Works on all platforms
pip install <package>
poetry add <package>
```

**cargo** (Rust):
```bash
# Works on all platforms
cargo install <package>
```

**go** (Go):
```bash
# Works on all platforms
go get <package>
go install <package>
```

### 3. Native Package Managers (OS-SPECIFIC)

#### macOS (Homebrew)

```bash
# Install Homebrew first
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install packages
brew install postgresql@16
brew install redis
brew install mongodb-community

# Start services
brew services start postgresql@16
brew services start redis
brew services start mongodb-community
```

#### Linux (apt - Ubuntu/Debian)

```bash
# PostgreSQL
sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib

# Redis
sudo apt-get install -y redis-server

# MongoDB
wget -qO- https://www.mongodb.org/static/pgp/server-7.0.asc | sudo tee /etc/apt/trusted.gpg.d/mongodb.asc
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start services
sudo systemctl start postgresql
sudo systemctl start redis-server
sudo systemctl start mongod

# Enable on boot
sudo systemctl enable postgresql
sudo systemctl enable redis-server
sudo systemctl enable mongod
```

#### Linux (dnf - Fedora/RHEL)

```bash
# PostgreSQL
sudo dnf install -y postgresql-server postgresql-contrib
sudo postgresql-setup --initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Redis
sudo dnf install -y redis
sudo systemctl start redis
sudo systemctl enable redis

# MongoDB
sudo dnf install -y mongodb-server
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Windows (Chocolatey)

```powershell
# Install Chocolatey first (as Administrator)
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install packages
choco install -y postgresql
choco install -y redis-64
choco install -y mongodb

# Services start automatically on Windows
```

**Note:** Windows users should prefer Docker Desktop or WSL2 for better compatibility.

---

## Path Handling

### Cross-Platform Paths

**Node.js:**
```typescript
import path from 'path';

// ✅ GOOD - Cross-platform
const filePath = path.join(__dirname, 'data', 'file.txt');
const absolutePath = path.resolve('./data/file.txt');

// ❌ BAD - Windows-specific
const badPath = 'C:\\Users\\data\\file.txt';

// ❌ BAD - Unix-specific (works on Windows but not ideal)
const unixPath = '/home/user/data/file.txt';
```

**Python:**
```python
from pathlib import Path
import os

# ✅ GOOD - Cross-platform
file_path = Path(__file__).parent / 'data' / 'file.txt'
absolute_path = Path.cwd() / 'data' / 'file.txt'

# ✅ GOOD - os.path also works
file_path = os.path.join(os.path.dirname(__file__), 'data', 'file.txt')

# ❌ BAD - Hardcoded separators
bad_path = 'C:\\Users\\data\\file.txt'
```

### Environment Variables

```bash
# Unix (macOS/Linux)
export DATABASE_URL="postgres://localhost/mydb"
echo $DATABASE_URL

# Windows (PowerShell)
$env:DATABASE_URL = "postgres://localhost/mydb"
echo $env:DATABASE_URL

# Windows (CMD)
set DATABASE_URL=postgres://localhost/mydb
echo %DATABASE_URL%
```

**Cross-platform .env files:**
```bash
# .env - Works everywhere with dotenv libraries
DATABASE_URL=postgres://localhost/mydb
REDIS_URL=redis://localhost:6379
```

---

## Shell Commands

### Prefer Language Scripts Over Shell

**❌ BAD - Shell-specific:**
```bash
# Won't work on Windows
#!/bin/bash
psql -U postgres -c "CREATE DATABASE mydb;"
```

**✅ GOOD - Use language-specific tools:**
```typescript
// Works everywhere with node-postgres
import { Client } from 'pg';

const client = new Client({
  host: 'localhost',
  user: 'postgres',
  password: 'password',
});

await client.connect();
await client.query('CREATE DATABASE mydb');
await client.end();
```

### Cross-Platform Scripts

**package.json:**
```json
{
  "scripts": {
    "start": "node dist/index.js",
    "build": "tsc",
    "test": "jest",
    "dev": "nodemon src/index.ts",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down"
  }
}
```

These npm scripts work identically on all platforms.

---

## Service Management

### Docker (Preferred)

```bash
# Start services - Works everywhere
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart service
docker-compose restart postgres
```

### Native Services

**macOS (Homebrew Services):**
```bash
brew services start postgresql
brew services stop postgresql
brew services restart postgresql
brew services list
```

**Linux (systemd):**
```bash
sudo systemctl start postgresql
sudo systemctl stop postgresql
sudo systemctl restart postgresql
sudo systemctl status postgresql
```

**Windows (Services):**
```powershell
# PowerShell
Start-Service postgresql-x64-16
Stop-Service postgresql-x64-16
Restart-Service postgresql-x64-16
Get-Service postgresql-x64-16

# Or use Services GUI (services.msc)
```

---

## Development Tools

### Required Tools (All Platforms)

1. **Docker Desktop**
   - macOS: https://docs.docker.com/desktop/install/mac-install/
   - Linux: https://docs.docker.com/desktop/install/linux-install/
   - Windows: https://docs.docker.com/desktop/install/windows-install/

2. **Git**
   - macOS: `brew install git` or Xcode Command Line Tools
   - Linux: `sudo apt-get install git` or `sudo dnf install git`
   - Windows: https://git-scm.com/download/win

3. **Node.js** (LTS version)
   - macOS: `brew install node`
   - Linux: `sudo apt-get install nodejs npm` or use nvm
   - Windows: https://nodejs.org/ or `choco install nodejs`

4. **Python** (3.11+)
   - macOS: `brew install python@3.11`
   - Linux: `sudo apt-get install python3.11 python3-pip`
   - Windows: https://www.python.org/ or `choco install python`

5. **VS Code** (Recommended)
   - All platforms: https://code.visualstudio.com/

---

## Connection Strings

### Cross-Platform Database URLs

```bash
# PostgreSQL - Same everywhere
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# MongoDB - Same everywhere
MONGODB_URI=mongodb://user:password@localhost:27017/dbname

# Redis - Same everywhere
REDIS_URL=redis://localhost:6379

# MySQL - Same everywhere
MYSQL_URL=mysql://user:password@localhost:3306/dbname
```

---

## Common Pitfalls

### ❌ AVOID

1. **Hardcoded paths:**
   ```typescript
   const file = '/usr/local/data/file.txt';  // Only works on Unix
   const file = 'C:\\Users\\data\\file.txt'; // Only works on Windows
   ```

2. **Shell-specific commands:**
   ```bash
   psql -U postgres  # Won't work on Windows without WSL
   ```

3. **Assuming bash:**
   ```bash
   #!/bin/bash  # Won't work on Windows
   ```

4. **Platform-specific package managers in code:**
   ```typescript
   execSync('brew install redis');  // Only works on macOS
   ```

### ✅ PREFER

1. **Use path libraries:**
   ```typescript
   import path from 'path';
   const file = path.join(process.cwd(), 'data', 'file.txt');
   ```

2. **Use client libraries:**
   ```typescript
   import { Client } from 'pg';  // Works everywhere
   ```

3. **Use Docker:**
   ```bash
   docker-compose up  # Works everywhere
   ```

4. **Use language package managers:**
   ```bash
   npm install redis  # Works everywhere
   pip install redis  # Works everywhere
   ```

---

## Testing Cross-Platform

### GitHub Actions Example

```yaml
name: Cross-Platform Tests

on: [push, pull_request]

jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
        node-version: [18, 20]

    runs-on: ${{ matrix.os }}

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
```

---

## Agent Best Practices

When creating agents, follow these guidelines:

1. **Always prefer Docker in examples** - Works everywhere
2. **Provide OS-specific alternatives** when native install is needed
3. **Use language package managers** (npm, pip, go get)
4. **Use path libraries** (path, pathlib) instead of hardcoded paths
5. **Test on multiple platforms** or use CI/CD with matrix builds
6. **Document OS requirements** if platform-specific (e.g., SwiftUI = macOS/iOS only)

### Example Agent Pattern

```typescript
/**
 * Setup PostgreSQL
 *
 * RECOMMENDED: Use Docker (works on all platforms)
 * ALTERNATIVE: Native installation (OS-specific)
 */

// Option 1: Docker (RECOMMENDED)
// docker-compose.yml
services:
  postgres:
    image: postgres:16
    ports:
      - "5432:5432"

// Option 2: Native Install (provide all platforms)
// macOS: brew install postgresql@16
// Linux: sudo apt-get install postgresql
// Windows: choco install postgresql

// Option 3: Use managed services (best for production)
// - AWS RDS
// - Azure Database for PostgreSQL
// - Google Cloud SQL
// - Supabase (free tier available)
```

---

## Quick Reference

| Task | macOS | Linux | Windows |
|------|-------|-------|---------|
| **Package Manager** | Homebrew | apt/dnf/yum | Chocolatey |
| **Install Docker** | Docker Desktop | Docker Desktop/Native | Docker Desktop |
| **Start Service** | `brew services start` | `systemctl start` | Services GUI |
| **Environment Vars** | `export VAR=value` | `export VAR=value` | `$env:VAR="value"` |
| **Path Separator** | `/` | `/` | `\` (but `/` works too) |
| **Shell** | bash/zsh | bash | PowerShell/cmd |

---

## Conclusion

**Golden Rules:**
1. 🐳 **Docker First** - Most reliable cross-platform solution
2. 📦 **Language Package Managers** - npm, pip, cargo, go get (all cross-platform)
3. 🔍 **OS Detection** - When native install needed, detect and use correct commands
4. 📁 **Path Libraries** - Never hardcode paths, use path.join() or pathlib
5. 🧪 **Test Everywhere** - Use CI/CD with matrix builds for macOS, Linux, Windows

Following these practices ensures all agents work seamlessly across all platforms! 🎉
