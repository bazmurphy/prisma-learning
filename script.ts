// this allows us to accept our prisma client
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// we create a function called main
async function main() {
  // we will write the Prisma Client queries here

  // with create, we must pass an object with a key "data" which itself is an object and inside of that pass in all the data
  const createUser = await prisma.user.create({ data: { name: "person1" } });
  // console.log("createUser:", createUser);

  const createUser2 = await prisma.user.create({
    data: { name: "person2", email: "person2@test.com", age: 99 },
  });
  // console.log("createUser2:", createUser2);

  // now if we try to add another user with the same name/email combination, we get:
  // Invalid `prisma.user.create()` invocation in
  // → 18 const createUser = await prisma.user.create(
  // Unique constraint failed on the fields: (`email`)

  // if we want to create a user but with more information on Models that are NOT DIRECTLY on the User
  // but on Models that the User references..
  // we can do all of that NESTED CREATION all within one nested create function
  const createUser3 = await prisma.user.create({
    data: {
      name: "person3",
      email: "person3@test.com",
      age: 20,
      userPreference: {
        create: {
          emailUpdates: true,
        },
      },
    },
    // and OPTIONALLY below you can do EITHER a SELECT or an INCLUDE but NOT BOTH
    // we can use 'select' to only get the name property
    select: {
      name: true,
      userPreference: { select: { id: true } },
    },
    // we can use 'include' to include (references to other Models/Tables rows) userPreferences in the return
    include: {
      userPreference: true,
    },
  });
  // console.log("createUser3:", createUser3);

  const createManyUsers = await prisma.user.createMany({
    data: [
      { name: "person1", age: 20, email: "person1@test.com" },
      { name: "person2", age: 30, email: "person2@test.com" },
      { name: "person3", age: 40, email: "person3@test.com" },
    ],
  });
  // console.log("createManyUsers:", createManyUsers);

  const findUniqueUser = await prisma.user.findUnique({
    where: {
      age_name: {
        age: 30,
        name: "person2",
      },
    },
  });
  // console.log("findUniqueUser:", findUniqueUser);

  const firstFirstUser = await prisma.user.findFirst({
    where: {
      name: "person3",
    },
  });
  // console.log("firstFirstUser:", firstFirstUser);

  const findAllUsers = await prisma.user.findMany();
  // console.log("getAllUsers:", getAllUsers);

  const findManyUsers = await prisma.user.findMany({
    where: {
      email: {
        contains: "test.com",
      },
    },
  });
  // console.log("findManyUsers:", findManyUsers);

  const findManyDistinctUsers = await prisma.user.findMany({
    where: {
      email: {
        contains: "person",
      },
    },
    distinct: ["email"],
  });
  // console.log("findManyDistinctUsers:", findManyDistinctUsers);

  const findManyPaginatedUsers = await prisma.user.findMany({
    where: {
      name: {
        contains: "person",
      },
    },
    orderBy: {
      age: "asc",
    },
    take: 2,
    skip: 1,
  });
  // console.log("findManyPaginatedUsers:", findManyPaginatedUsers);

  const findManyUsersWhereIn = await prisma.user.findMany({
    where: {
      name: { in: ["person1", "person2"] },
    },
  });
  // console.log("findManyUsersWhereIn:", findManyUsersWhereIn);

  const findManyUsersWhereNotIn = await prisma.user.findMany({
    where: {
      name: { notIn: ["person1", "person2"] },
    },
  });
  // console.log("findManyUsersWhereNotIn:", findManyUsersWhereNotIn);

  const findManyUsersWhereLessThan = await prisma.user.findMany({
    where: {
      age: { lt: 30 },
    },
  });
  // console.log("findManyUsersWhereLessThan:", findManyUsersWhereLessThan);

  const findManyUsersWhereGreaterThan = await prisma.user.findMany({
    where: {
      age: { gt: 30 },
    },
  });
  // console.log("findManyUsersWhereGreaterThan:", findManyUsersWhereGreaterThan);

  const findManyUsersWhereContains = await prisma.user.findMany({
    where: {
      email: {
        contains: ".com",
      },
    },
  });
  // console.log("findManyUsersWhereContains:", findManyUsersWhereContains);

  const findManyUsersWhereStartsWith = await prisma.user.findMany({
    where: {
      email: {
        startsWith: "person",
      },
    },
  });
  // console.log("findManyUsersWhereStartsWith:", findManyUsersWhereStartsWith);

  const findManyUsersWhereEndsWith = await prisma.user.findMany({
    where: {
      email: {
        endsWith: ".com",
      },
    },
  });
  // console.log("findManyUsersWhereEndsWith:", findManyUsersWhereEndsWith);

  const findManyUsersWhereAnd = await prisma.user.findMany({
    where: {
      AND: [
        { email: { startsWith: "person" } },
        { email: { endsWith: "@test.com" } },
      ],
    },
  });
  // console.log("findManyUsersWhereAnd:", findManyUsersWhereAnd);

  const findManyUsersWhereNot = await prisma.user.findMany({
    where: {
      NOT: [{ email: { startsWith: "person1" } }],
    },
  });
  // console.log("findManyUsersWhereNot:", findManyUsersWhereNot);

  const oneToOneRelationship = await prisma.user.findMany({
    where: {
      userPreference: {
        emailUpdates: true,
      },
    },
  });
  // console.log("oneToOneRelationship:", oneToOneRelationship);

  const oneToManyRelationship = await prisma.user.findMany({
    where: {
      writtenPosts: {
        every: {
          // some: {
          // none: {
          title: { startsWith: "Test" },
        },
      },
    },
  });
  // console.log("oneToManyRelationship:", oneToManyRelationship);

  const relationshipFiltering = await prisma.post.findMany({
    where: {
      author: {
        is: {
          age: 20,
        },
        // isNot: {
        //  age: 30,
        // }
      },
    },
  });
  // console.log("relationshipFiltering:", relationshipFiltering);

  const updateUser = await prisma.user.update({
    where: {
      email: "person3@test.com",
    },
    data: {
      email: "person4@test.com",
    },
  });
  // console.log("updateUser:", updateUser);

  const updateManyUsers = await prisma.user.updateMany({
    where: {
      name: "Bob",
    },
    data: {
      name: "Robert",
    },
  });
  // console.log("updateManyUsers:", updateManyUsers);

  const updateUserIncrement = await prisma.user.update({
    where: {
      email: "person1@test.com",
    },
    data: {
      age: {
        increment: 1,
        // decrement: 1,
        // multiply: 10,
        // divide: 10,
      },
    },
  });
  // console.log("updateUserIncrement:", updateUserIncrement);

  const updateUserAndCreateRelationship = await prisma.user.update({
    where: {
      email: "person1@test.com",
    },
    data: {
      userPreference: {
        create: {
          emailUpdates: true,
        },
      },
    },
  });
  // console.log("updateUserAndCreateRelationship:", updateUserAndCreateRelationship);

  const updateUserAndConnectRelationship = await prisma.user.update({
    where: {
      email: "person1@test.com",
    },
    data: {
      userPreference: {
        connect: {
          id: "127acbb7-b8b3-461b-957d-2cfec4e524c1",
        },
      },
    },
  });
  // console.log("updateUserAndConnectRelationship:", updateUserAndConnectRelationship);

  const updateUserAndDisconnectRelationship = await prisma.user.update({
    where: {
      email: "person1@test.com",
    },
    data: {
      userPreference: {
        disconnect: true,
      },
    },
  });
  // console.log("updateUserAndDisconnectRelationship:", updateUserAndDisconnectRelationship);

  const deleteUser = await prisma.user.delete({
    where: {
      email: "person3@test.com",
    },
  });
  // console.log("deleteUser:", deleteUser);

  const deleteAllUsers = await prisma.user.deleteMany();
  // console.log("deleteAllUsers:", deleteAllUsers)

  const deleteManyUsers = await prisma.user.deleteMany({
    where: {
      age: { lt: 18 },
    },
  });
  // console.log("deleteManyUsers:", deleteManyUsers);
}

// we call main
main()
  // catch any errors and print them out
  .catch((error) => {
    console.error(error.message);
  })
  // or if we are done, we finally disconnect from the prisma database
  // although it automatically disconnects
  .finally(async () => {
    await prisma.$disconnect();
  });
