This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started
First Download Docker and Docker Cli
````md
# Docker Installation Guide (macOS & Windows)

This guide explains how to install Docker, verify the Docker CLI, and test Docker on macOS and Windows systems.

---

## What Is Included

Installing Docker Desktop provides:
- Docker Engine
- Docker CLI
- Docker Compose

---

## Installation on macOS

### System Requirements
- macOS 12 or newer
- Apple Silicon (M1/M2/M3) or Intel processor
- Minimum 4 GB RAM (8 GB recommended)

### Installation Steps

1. Download Docker Desktop  
   https://www.docker.com/products/docker-desktop/

2. Choose the correct installer:
   - Mac with Apple chip
   - Mac with Intel chip

3. Install Docker
   - Open the downloaded `.dmg` file
   - Drag `Docker.app` into the `Applications` folder

4. Start Docker
   - Open `Applications → Docker`
   - Grant required permissions
   - Wait until Docker status shows running

---

### Verify Installation (macOS)

Open Terminal and run:
```bash
docker --version
docker compose version
````

### Test Docker (macOS)

```bash
docker run hello-world
```

---

## Installation on Windows (Windows 10/11)

### System Requirements

* Windows 10/11 (64-bit)
* WSL 2 enabled
* Virtualization enabled in BIOS

---

### Step 1: Enable WSL 2

Open PowerShell as Administrator and run:

```powershell
wsl --install
```

Restart the system if prompted.

Verify WSL installation:

```powershell
wsl --version
```

---

### Step 2: Install Docker Desktop

1. Download Docker Desktop
   [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)

2. Run the installer

   * Enable "Use WSL 2 backend" when prompted

3. Restart the system if required

4. Start Docker Desktop

---

### Verify Installation (Windows)

Open PowerShell, Command Prompt, or WSL terminal:

```bash
docker --version
docker compose version
```

### Test Docker (Windows)

```bash
docker run hello-world
```

---

## Common Docker CLI Commands

### Check Docker status

```bash
docker info
```

### Pull an image

```bash
docker pull nginx
```

### Run a container

```bash
docker run -d -p 8080:80 nginx
```

Open in browser:

```
http://localhost:8080
```

### List containers

```bash
docker ps
docker ps -a
```

### Stop a container

```bash
docker stop <container_id>
```

### Remove a container

```bash
docker rm <container_id>
```

---

## Docker Compose Test

Create a file named `docker-compose.yml`:

```yaml
services:
  web:
    image: nginx
    ports:
      - "8080:80"
```

Run:

```bash
docker compose up -d
```

Stop:

```bash
docker compose down
```

---

## Troubleshooting

### docker command not found

* Ensure Docker Desktop is running
* Restart Docker Desktop

### Virtualization error on Windows

* Enable Virtualization in BIOS
* Enable Virtual Machine Platform in Windows Features

### Permission denied error

```bash
sudo docker run hello-world
```

---

## Conclusion

Docker and Docker CLI are successfully installed and ready to use.

```
```


Then build and run the project in docker:

To build the app:
```bash
docker build -t indian-word-processor .
```
To run the app at local Host:
```bash
docker run -d -p 3000:3000 --name my-word-app indian-word-processor
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Render

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
