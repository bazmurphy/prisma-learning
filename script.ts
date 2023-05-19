// this allows us to accept our prisma client
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// we create a function called main
async function main() {
  // we will write the Prisma Client queries here

  // with create, we must pass an object with a key "data" which itself is an object and inside that pass in all the data
  // we are waiting for prisma to create a user for us and put in our database with the name of Baz and return that user and then we console log it
  // const user = await prisma.user.create({ data: { name: "Bob" }})
  // console.log(user);

  // to find all of our Users
  const users = await prisma.user.findMany();
  console.log(users);
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