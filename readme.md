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

## generator

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

Defining something in the prisma schema DOES NOT CREATE OR DO ANYTHING to our Database.

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

## generate your client

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

// we call main
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

## create

with create, we must pass an object with a key "data" which itself is an object and inside that pass in all the data
we are waiting for prisma to create a user for us and put in our database with the name of Baz and return that user and then we console log it

```
  const user = await prisma.user.create({ data: { name: "Baz" }})
  console.log(user);
```

## running main

we need to add `"dev" : "nodemon script.ts"` to our `package.json`
and that will automatically compile and re-run our script.ts file evertyime we make changes.

```
[nodemon] starting `ts-node script.ts`
{ id: 1, name: 'Baz' }
[nodemon] clean exit - waiting for changes before restart
```

Change the name to "Bob" and save, nodemon re-runs and adds "Bob" to the database.

```
[nodemon] starting `ts-node script.ts`
{ id: 2, name: 'Bob' }
```

## findMany (find all the users)

To find all of our users:

```
  const users = await prisma.user.findMany();
  console.log(users);
```

```
[nodemon] starting `ts-node script.ts`
[ { id: 1, name: 'Baz' }, { id: 2, name: 'Bob' } ]
```

Summary:

1. at the very top you create your schema
2. the schema defines the `datasource db` you are using (the database you are using)
3. the schema defines the generator for how you go from your schema to your typescript code
4. and it defines all of your different models and enums and everything related to your databse ALL INSIDE THIS ONE FILE `schema.prisma`
5. then you create your migrations, and your migrations allow you to make changes to your database based on the changes you make in the `schema.prisma` so when you update the file it will automatically create a migration that moves you to the next step so your database is always up to date with this file.
6. in doing that migration you are updating your code with the `generator client`, the generator creates the `@prisma/client` where you `import { PrismaClient }` from, which allows you to interact with your code through this Prisma library. So you do not have to write raw SQL Queries.
7. So the schema file allows you to define your database, migrate your database, and interact with your database. It is your single source of truth and really important to understand.

---

## deeper dive on datasources & generators

Now we will cover everything you can do in the schema file for prisma. And it is a lot.

### datasource

you can only ever have one datasource - prisma is directly connecting to your database
it must have a provider which is the name of the database you are using
and it must have a url which links to that particular database
it is really important to use environment variables to store all your database information to keep it secure
and you can change the database that you are using for development, stating, and production etc.

### generators

you can have multiple generators for our prisma client
we could have some other generators for example for graphQL there are tonnes of different generators out there
to define the generator, you just give it the provider and that links to the name of the generator

---

### models

models represent the different tables inside your database
each model is composed of a bunch of different fields
each row is considered a field
a field is composed of 4 different parts (2 mandatory, and then 2 optional)

1. the name (id, name, email)
2. the type of that field (Int, String)
3. field type modifier (the name is optional) String?
4. attributes (all the things that start with @) @id @defaultvalue

field types:

1. `Int` - Integer
2. `String` - String
3. `Boolean` - Boolean
4. `BigInt` - Very Large Number
5. `Float` - Float
6. `Json` - Json Data Type (not everything supports this but PostgreSQL does)
7. `Bytes` - blob (file data, big data that you need to convert down into raw byte information)
8. `Unsupported` - it is not something you will ever write yourself inside of a Prisma Schema file (Prisma allows you to take a Database that already exists and convert it to a Schema file, and if it does not support that Data type it will use this)
9. Using another Model eg. author `User`, when you save it will autopopulate a lot of information, `author User @relation(fields: [userId], references: [id])`, this is how you make different relationships inside of PostgreSQL.

---

### 3 Different types of Relationship `relation`

1. one to many relationship - a `Post` has one `Author` and a `User` has many `Posts`
2. many to many relationship - one `Post` could have a `Category` and a `Category` could have many `Posts` (so each post has many Categories and many Categories have many Posts)
3. one to one relationship - a `User` has a table of `Preferences` - each `User` has one reference in that `Preference` table - and each `Preference` has one `User` it links to

---

### One to Many Relationships

A User has many Posts

#### Field Type Modifier

the `Post[]` the Array syntax is a **Field Type Modifier**
there are only two modifiers you need to know of

1. the `[]` array one, which means there could be multiple of this thing, example `Post[]`
2. the `?` which means it is optional, example `Json?`

the `fields` is stating which field inside of the `Post` (`authorId`) is referencing the `id` inside of User table
the `authorId` field in our `Post` references the `id` field in our User and those two should be the same
whenever the `authorId` is the same as the `id` that means they are linked together, like a foreign key relationship in SQL

#### autoincrement vs uuid

instead of:

`id Int @id @default(autoincrement())`

we can use:

`id String @id @default(uuid())`

But we must also now change `authorId` to a `String` type

And also our `Post` should have an `id`

```
model User {
  id          String  @id @default(uuid())  <--- here
  name        String
  email       String
  isAdmin     Boolean
  preferences Json
  posts       Post[]
}

model Post {
  id        String   @id @default(uuid())
  rating    Float
  createdAt DateTime
  updatedAt DateTime
  author    User     @relation(fields: [authorId], references: [id])   <--- here
  authorId  String   <--- here
}

```

### Disambiguating Multiple One to Many Relationships

What happens if a `User` can have 2 references to a `Post`

A `Post` can be `favourited` and a `User` can have multiple `favourited` `Posts` and multiple `Posts` that they have `written`

We have to give the relationship a `Label` and that `Label` can be shared with all the other fields

These are `Labels`: `"WrittenPosts"` and `"FavouritePosts"`

```
model User {
  id             String  @id @default(uuid())
  name           String
  email          String
  isAdmin        Boolean
  preferences    Json
  writtenPosts   Post[]  @relation("WrittenPosts")   <--- here
  favouritePosts Post[]  @relation("FavouritePosts")   <--- here
}

model Post {
  id             String   @id @default(uuid())
  rating         Float
  createdAt      DateTime
  updatedAt      DateTime
  author         User     @relation("WrittenPosts", fields: [authorId], references: [id])   <--- here
  authorId       String
  favouritedBy   User?     @relation("FavouritePosts", fields: [favouritedById], references: [id])   <--- here
  favouritedById String?
}
```

This `"WrittenPosts"` references the `author` and `authorId` section
This `"FavouritedPosts"` references the `favouritedBy` and `favouritedById` section

You only need to do this extra step **if you have two references to the exact same Table**

We also make our `favouritedBy` and `favouritedById` optional using `?` (because both of those fields are linked to the same thing)

---

### Many to Many Relationships

We have a Model `Category` with an `id` and multiple posts
One `Category` can reference multiple different `Post`s
And a `Post` can have multiple different `Category`s

```
model Post {
  id             String     @id @default(uuid())
  rating         Float
  createdAt      DateTime
  updatedAt      DateTime
  author         User       @relation("WrittenPosts", fields: [authorId], references: [id])
  authorId       String
  favouritedBy   User?      @relation("FavouritePosts", fields: [favouritedById], references: [id])
  favouritedById String?
  categories     Category[]   <----- here
}

model Category {
  id   String @id @default(uuid())
  post Post[]   <----- here
}

```

We don't need to add any relationships.
Prisma automatically knows our `Category[]` is referencing our `Category` Model and our `Post[]` is referencing our `Post` Model.
Prisma will automatically create a JOIN Table between the 2 that is going to hookup these relationships for us.
All the complicated join stuff you would have to do with many to many dimensional relationships is taken care of by Prisma.

So all of our `Post`s can have multiple `Category`s and all of our `Category`s can have multiple `Post`s

---

### One to One Relationship

One `User` will have one set of user `Preferences`

Now we want to reference the `User` table from our `UserPreference`

Since we are doing a One to One Relationship you can store the relationship on EITHER the `User` table or the `UserPreference` table

```
model User {
  id             String          @id @default(uuid())
  name           String
  email          String
  isAdmin        Boolean
  writtenPosts   Post[]          @relation("WrittenPosts")
  favouritePosts Post[]          @relation("FavouritePosts")
  UserPreference UserPreference?   <----- here
}

model UserPreference {
  id            String  @id @default(uuid())
  emailUpodates Boolean
  user          User    @relation(fields: [userId], references: [id])   <----- here
  userId        String  @unique   <----- here
}
```

It must be unique because we can only ever have one `UserPreference` reference one `User`
We can't have multiple `UserPreference`s referencing the same `User`
Thats how the One to One Relationship works.

---

### Attributes `@`

#### Field Based Attributes

These are in the same row as the fields and they have a single `@` infront of them

So far we have seen `@id` `@default` `@relation`
But there are many more field based attributes...

`@unique`
Example: `email String @unique` Now every single email is going to be unique..

`@updatedAt`
Every time we update the record it will automatically update as the current timestamp

`@default(now())`
Every time the record is created it will automatically add the current timestamp

```
model User {
  id             String          @id @default(uuid())
  age            Int
  name           String
  email          String          @unique
  isAdmin        Boolean
  writtenPosts   Post[]          @relation("WrittenPosts")
  favouritePosts Post[]          @relation("FavouritePosts")
  UserPreference UserPreference?
}

model UserPreference {
  id            String  @id @default(uuid())
  emailUpdates Boolean
  user          User    @relation(fields: [userId], references: [id])
  userId        String  @unique
}

model Post {
  id             String     @id @default(uuid())
  title          String
  averageRating  Float
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt
  author         User       @relation("WrittenPosts", fields: [authorId], references: [id])
  authorId       String
  favouritedBy   User?      @relation("FavouritePosts", fields: [favouritedById], references: [id])
  favouritedById String?
  categories     Category[]
}

model Category {
  id   String @id @default(uuid())
  name String @unique
  post Post[]
}

```

#### Block Level Attributes

Block Level Atrributes are on their own line completely inside of the Model `{ }` and they have 2 @ symbols `@@`

Examples: `@@unique()` `@@index()` `@@id()`

Example: We can have a Uniqueness constraint on `name` and `age`

So we cannot have a User with the same `name`and the same`age`

We can also create an `index` on the `email` field, this will help with sorting and performance..
If we wanted to Query by `email` it would be good to have an index

```
model User {
  id             String          @id @default(uuid())
  age            Int
  name           String
  email          String          @unique
  isAdmin        Boolean
  writtenPosts   Post[]          @relation("WrittenPosts")
  favouritePosts Post[]          @relation("FavouritePosts")
  UserPreference UserPreference?

  @@unique([age, name])   <--- here
  @@index([email])
}
```

We can create a COMPOSITE `id` which contains 2 different things

So instead of having a specific `id` we have a COMPOSITE `id`
Where our unique `title` and `author` combination represent our `id` for the `Post` instead of the `id` at the top

```
model Post {
  // id             String     @id @default(uuid())
  title          String
  averageRating  Float
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt
  author         User       @relation("WrittenPosts", fields: [authorId], references: [id])
  authorId       String
  favouritedBy   User?      @relation("FavouritePosts", fields: [favouritedById], references: [id])
  favouritedById String?
  categories     Category[]

  @@id([title, authorId])
}
```

---

### Enum

If you use that hard coded list of values that a field value can be, using an `Enum` is a great way to do that
Example: `BASIC`, `EDITOR`, `ADMIN`
It will only allow you to specify one of those specific values instead of any value

```
model User {
  id             String          @id @default(uuid())
  age            Int
  name           String
  email          String          @unique
  role           Role            @default(BASIC)   <--- here
  writtenPosts   Post[]          @relation("WrittenPosts")
  favouritePosts Post[]          @relation("FavouritePosts")
  UserPreference UserPreference?

  @@unique([age, name])
  @@index([email])
}

enum Role {   <--- here
  BASIC
  EDITOR
  ADMIN
}
```

---

## Migrating our Database

Once our schema is defined... we can migrate our database:

`npx prisma migrate dev`

```
Applying migration `20230606113235_test`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └─ 20230606113235_test/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (4.14.1 | library) to .\node_modules\@prisma\client in 178ms
```

---

## Prisma Functionalities

### `new PrismaClient()`

When you create the `new PrismaClient()` it actually manages different connections for you
If your Database supports 5 concurrent connections for you
So its really important that you only use **ONE INSTANCE** of the `PrismaClient()` otherwise you can bog down your Database with too many connections.

### Create

`.create()`
takes in an object
first key is `data` which is an object
that takes all the required field key/values to create a row/record

```
  await prisma.user.create({
    data: { name: "Baz", email: "baz@test.com", age: 99 },
  });
```

we can use `create` inside of here to make nested creations in other referenced Tables
here we add a `UserPreference` (which is another Table/Model) and set the `emailUpdates: true` for example:

```
await prisma.user.create({
  data: {
    name: "Baz",
    email: "baz@test2.com",
    age: 99,
    userPreference: {
      create: {
        emailUpdates: true,
      },
    },
  }
});
```

### `select` or `include`

the second key can be either `select` or `include`

`select` allows us to choose exact what is returned to us, in the example below, only the name from the `User` Model and the `id` from the `UserPreference` Model.

```
await prisma.user.create({
  data: {
    name: "Baz",
    email: "baz@test2.com",
    age: 99,
    userPreference: {
      create: {
        emailUpdates: true,
      },
    },
  },
  select: {
    name: true,
    userPreference: { select: { id: true } },
  },
});
```

returns:

```
{
  name: 'Baz',
  userPreference: { id: '5f174d35-c548-4266-9d90-bfe96cae0709' }
}
```

`include`
allows us to include different references to other fields in other Models/Tables.
for example here in the return we include the `userPreference`

```
await prisma.user.create({
  data: {
    name: "Baz",
    email: "baz@test2.com",
    age: 99,
    userPreference: {
      create: {
        emailUpdates: true,
      },
    },
  },
  include: {
     userPreference: true,
  },
});
```

returns:

```
{
  id: '1ed699fd-e198-400d-a9a1-210922de7b5d',
  age: 99,
  name: 'Baz',
  email: 'baz@test2.com',
  role: 'BASIC',
  userPreferenceId: '498790b8-e075-46d8-af9f-e7977607fd8e',
  userPreference: { id: '498790b8-e075-46d8-af9f-e7977607fd8e', emailUpdates: true }
}
```

### `new PrismaClient({ log: ["query"] })`

If you want to log out all the queries we can add an object and provide the key of log, and an array with the values of everything we want to log.

This is good if you need to debug anything

An example of a logged prisma operation:

```
prisma:query BEGIN
prisma:query INSERT INTO "public"."UserPreference" ("id","emailUpdates") VALUES ($1,$2) RETURNING "public"."UserPreference"."id"
prisma:query INSERT INTO "public"."User" ("id","age","name","email","role","userPreferenceId") VALUES ($1,$2,$3,$4,$5,$6) RETURNING "public"."User"."id"
prisma:query SELECT "public"."User"."id", "public"."User"."name", "public"."User"."userPreferenceId" FROM "public"."User" WHERE "public"."User"."id" = $1 LIMIT $2 OFFSET $3
prisma:query SELECT "public"."UserPreference"."id" FROM "public"."UserPreference" WHERE "public"."UserPreference"."id" IN ($1) OFFSET $2
prisma:query COMMIT
```

### Create Many `createMany()`

You pass in an **array** for `data` and **not a single object**.

Note: You CANNOT use the `select` clause inside a `createMany()`

```
await prisma.user.createMany({
  data: [
    { name: "person1", age: 20, email: "person1@test.com" },
    { name: "person2", age: 30, email: "person2@test.com" },
    { name: "person3", age: 40, email: "person3@test.com" },
  ],
});

```

### Find Unique `findUnique()`

Find things by `@unique` keys in the Database

We can use a `where : {}` clause

You can also optionally add a `select` or `include` (the same as when using `create()`)

```
await prisma.user.findUnique({
  where: {
    email: "person1@test.com",
  },
});
```

#### Uniqueness Constraints on Multiple Fields

In our Prisma Schema for `User` Model.. we have `@@unique([age, name])`
Prisma creates these as `age_name` where there is the key names with underscores separating them
We can use this as `age_name` in a where and pass it each key/value we are looking for.

And it will find the `User` that has that `@@unique` `age` and `name` combination

```
await prisma.user.findUnique({
  where: {
    age_name: {
      age: 30,
      name: "person2",
    },
  },
});
```

#### `findUnique()` on NON unique

We cannot search for things using where that DO NOT HAVE A UNIQUENESS CONSTRAINT on them.

For example we cannot `findUnique()` on `name`, if we wanted to search for `name` we need to use `find`

### Find First `findFirst()`

This will find the first thing that matches a query, **it allows you to use any property** in `where: { }`

```
await prisma.user.findFirst({
  where: {
    name: "person3",
  },
});
```

### Find Many `findMany()`

This will find all records that meet the criteria

```
await prisma.user.findMany({
  where: {
    email: {
      contains: "person",
    },
  },
});
```

#### Distinct `distinct: []`

We can add a `distinct: []` after the `where`
`distinct` is an array `[]` where we add the properties we want to filter by
We can add multiple entries to that array `["property1", "property2"]`

```
  await prisma.user.findMany({
    where: {
      name: {
        contains: "person",
      },
    },
    distinct: ["name"],
  });
```

#### Pagination `take` & `skip`

`take: 0` comes after `where` and you provide it a number, and it returns that many records/rows

`skip: 0` can also be added so we can skip the first X record/rows

The example below skips the 1st record/row and then returns 2 Users after that

```
await prisma.user.findMany({
  where: {
    name: {
      contains: "person",
    },
  },
  take: 2,
  skip: 1,
});
```

#### OrderBy `orderBy: { }`

We can add an `orderBy: { key: "asc/desc" }` to order the records/rows

```
const findManyPaginatedUsers = await prisma.user.findMany({
  where: {
    name: {
      contains: "person",
    },
  },
  orderBy: {
    age: "asc",
  }
});
```

#### Where Clauses `where: { }`

#### Equals `equals`

`equals` is equal

```
where: {
  name: { equals: "person" }
}
```

#### Not `not`

`not` is not equal

```
where: {
  name: { not: "person" }
}
```

#### In `in`

`in: []` a specified list of all values we are looking for

```
await prisma.user.findMany({
  where: {
    name: { in: ["person1", "person2"] },
  },
});
```

### Not In `notIn`

`notIn: []` the opposite of the above, where we want to find all values that are NOT these

```
await prisma.user.findMany({
  where: {
    name: { notIn: ["person1", "person2"] },
  },
});
```

#### Less Than `lt`

`lt: 20` find all records where X is less than the given value

```
await prisma.user.findMany({
  where: {
    age: { lt: 30 },
  },
});
```

#### Less Than `lt` Less Than Or Equal To `lte`

`lt: 20` find all records where X is less than the given value

```
await prisma.user.findMany({
  where: {
    age: { lt: 30 },
  },
});
```

#### Greater Than `gt` Greater Than Or Equal To `gte`

`gt: 20` find all records where X is greater than the given value

```
await prisma.user.findMany({
  where: {
    age: { gt: 30 },
  },
});
```

### Multiple `where` making a pseudo `AND`

If we stack multiple items inside the `where` it is somewhat similar to doing an `AND` in SQL

```
await prisma.user.findMany({
  where: {
    name: {
      contains: person
    }
    age: { gt: 30 },
  },
});
```

#### Contains `contains`

We can use this to test if the string of the value includes this substring
Example: Does the email contain the substring ".com"

```
await prisma.user.findMany({
  where: {
    email: {
      contains: "@test.com"
    }
  },
});
```

#### endsWith `endsWith`

Checks the end of the string

```
await prisma.user.findMany({
  where: {
    email: {
      endsWith: "@test.com"
    }
  },
});
```

#### startsWith `startsWith`

Checks the end of the string

```
await prisma.user.findMany({
  where: {
    email: {
      startsWith: "person"
    }
  },
});
```

### `AND` `OR` `NOT`

`AND: []` is an Array that takes each individual object that relates to a field value and meets some condition

```
await prisma.user.findMany({
  where: {
    AND: [
      { email: { startsWith: "person" } },
      { email: { endsWith: "@test.com" } },
    ],
  },
});
```

`NOT: []` is an Array that takes each individual object that relates to a field value and does NOT meet some condition

```
await prisma.user.findMany({
  where: {
    NOT: [{ email: { startsWith: "person1" } }],
  },
});
```

### Queries on RELATIONSHIPS

#### One to One Query

We can do queries on a Relationship
`emailUpdates` is in another Model/Table `UserPreference` but our query is on the `User` Model/Table

```
await prisma.user.findMany({
  where: {
    userPreference: {
      emailUpdates: true,
    }
  }
})
```
