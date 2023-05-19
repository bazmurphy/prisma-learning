# Prisma Learning

(This readme was handwritten by https://github.com/bazmurphy)

Initalise as a git repository `git init`

Initialise as a node project `npm init -y`

Install the dependencies `npm i --save-dev prisma typescript ts-node @types/node nodemon`

Initialise prisma specifically telling it we will be using a postgresql database `npx prisma init --datasource-provider postgresql`

```
✔ Your Prisma schema was created at prisma/schema.prisma
  You can now open it in your favorite editor.

Next steps:
1. Set the DATABASE_URL in the .env file to point to your existing database. If your database has no tables yet, read https://pris.ly/d/getting-started
2. Run prisma db pull to turn your database schema into a Prisma schema.
3. Run prisma generate to generate the Prisma Client. You can then start querying your database.

More information in our documentation:
https://pris.ly/d/getting-started
```

This creates a `prisma` folder, a `.env`, and a `.gitignore` automatically.

Inside the `prisma` folder we have a `schema.prisma` this is the Schema

And inside the `schema.prisma` we have a `generator` and we have a `datasource`

In the .env file we have the `DATABASE_URL` which si the `postgresql://` link to our Database:

```
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
```

USER: The name of your database user
PASSWORD: The password for your database user
HOST: The name of your host name (for the local environment, it is localhost)
PORT: The port where your database server is running (typically 5432 for PostgreSQL)
DATABASE: The name of the database
SCHEMA: The name of the schema inside the database

If you're unsure what to provide for the schema parameter for a PostgreSQL connection URL, you can probably omit it. In that case, the default schema name public will be used.

We should install this VSCode Extension for syntax highlighting:
   Name: Prisma
   Description: Adds syntax highlighting, formatting, auto-completion, jump-to-definition and linting for .prisma files.
   VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=Prisma.prisma

prisma has a formatter built in, so you can format your file with `npx prisma format` if you need to, it is better to do it within VSCode settings (in the JSON) :
```
"editor.formatOnSave": true,
"editor.defaultFormatter": "Prisma.prisma",
```

## schema file

you will define a bunch of code for your database in this prisma format
it is not SQL it is not NoSQL it is prisma, it is its own format, separate from any other type of formatting
you need to define your code in this prisma specific format

##  generator

and when you run your `generator` what are you generating it into, in this case we will generate it into the `prisma-client-js`

take all of this prisma code and convert it using the `prisma-client-js` formatter which is the default generator
(and 99% of your projects will use this) but if you are using a GraphQL API there are different generators that can generator code for you based on your Schema if you want an extra layer, you can change the generator.

the generator is what your code is generated into

## datasource

`provider` is just what provider our database is coming from
`url` which is defined in the environment variable `.env` the URL to the postgresql db with user/pass url databasename etc.

## defining our schema

```
model User {
  id   Int    @id @default(autoincrement())
  name String
}
```

here is a Model Schema with an id and a name

Defining something in the prisma schema DOES NOT CREATE OR DO to our Database.

## migrating

We need to tell Prisma I am done making changes to my Schema, can you apply them to my database.

Migrate my changes to what I had before (which was nothing) to now having this User model.

We have to run a command
`npx prisma migrate`
and you can optionally pass in a name
`npx prisma migrate dev`

That means we are pushing a migration that is in our development environment and we can name our migration

here we use init to mean we are initialising our database with this new User model
`npx prisma migrate dev --name init`

it makes a brand new migration that will interact with our Database.

```
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
Datasource "db": PostgreSQL database "prisma_project_database", schema "public" at "dpg-chjqrnqk728k56na03ig-a.frankfurt-postgres.render.com"

Applying migration `20230519174607_init`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20230519174607_init/
    └─ migration.sql

Your database is now in sync with your schema.

Running generate... (Use --skip-generate to skip the generators)

added 2 packages, and audited 56 packages in 7s

3 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

✔ Generated Prisma Client (4.14.1 | library) to .\node_modules\@prisma\client in 67ms
```

And we have a `migrations` folder inside of Prisma
And we have a timestamp folder and then inside of that a `migration.sql`

```
-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
```

## client generated

It also said it has `Generated Prisma Client` and put it in `\node_modules\@prisma\client`

We have created a brand new Prisma client.
And the `client` is the thing from the `generator`.

Make me a new `client` whenever i make changes to my prisma code and i make changes to my database. Such as adding this User Model i want you to update my client code which in this case is `provider = prisma-client-js`

And that's what will happen everytime you do a Migration it will update your `client` for you.

And that `client` is all of the code for interacting with your database.

Now we added the User model our client automatically added a bunch of code for us to allows us to interact with Users, create them, read them, update them, delete them etc. And all of it is Typed with Typescript so we have nice Type safety blanket.

## client library

We don't have a client yet because we haven't installed the client library.

`npm i @prisma/client`

This will install the client that will allow us to generate and use this client

If you needed to manually regenerate your client for any reason you can:

`npx prisma generate`

It will go through all the steps of generating based on the provider we want `provider = prisma-client-js`

```
Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma

✔ Generated Prisma Client (4.14.1 | library) to .\node_modules\@prisma\client in 75ms
You can now start using Prisma Client in your code. Reference: https://pris.ly/d/client

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
```

## using the client

So now we can start using that client because it generated it for us and stored it in that particular location `\node_modules\@prisma\client`

Now we create a `script.ts` and copy that in:
```
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
```
When we type `prisma.` we can see all the methods as well as `user` which represents the User table we just created from the Schema Model it automatically generated for us

and so when we do `prisma.user.` we can see a bunch of the methods

for example `prisma.user.findFirst` to get the first user based on the criteria we pass it.

## main function

```
// we create a function called main
async function main() {
  // we will write the Prisma Client queries here
}

// call main
main()
  // catch any errors and print them out
  .catch(error => {
    console.error(error.message)
  })
  // or if we are done, we finally disconnect from the prisma database
  // although it automatically disconnects
  .finally(async() => {
    await prisma.$disconnect()
  })
```

So now we can write our queries inside this `main` function.

Almost everything in Prisma is asynchronous, so thats why main is an async function. It wil run, wait, and give you a result.

