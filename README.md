# Storium — File Storage App

This is a full-stack file storage system with support for folder hierarchies, file management.
Built with **NestJS** (backend) and **Next.js** (frontend).

## ⚙️ Tech Stack

* [NestJS](https://nestjs.com/)
* [Next.js (App Router)](https://nextjs.org/)
* TypeScript
* PostgreSQL
* TypeORM
* SWR (data fetching)
* TailwindCSS
* Swagger (API Docs)
* Docker

## 🚀 Running with Docker

### 1. Create `.env` file

In the root of the project, create the `.env` file according to `.env.example`.

### 2. Start the project

```bash
docker-compose up --build
```

* Frontend will run at: [http://localhost:3000](http://localhost:3000)
* Backend will run at: [http://localhost:4000](http://localhost:4000)

### 3. API Docs

After the server starts, Swagger is available at: [http://localhost:4000/doc](http://localhost:4000/doc)
