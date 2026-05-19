This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Installing dependencies
```bash
#PRISMA
pnpm add prisma @types/node @types/better-sqlite3 -D
pnpm add @prisma/client @prisma/adapter-better-sqlite3 dotenvo

# Create Prisma Schema 
pnpm dlx prisma init --datasource-provider sqlite --output ../generated/prisma

# Create migration and generate Prisma Client:
pnpm dlx prisma migrate dev --name init
pnpm dlx prisma generate

#BCRYPT
pnpm add bcrypt
pnpm add -D @types/bcrypt
```
First, run the development server:

```bash

pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
