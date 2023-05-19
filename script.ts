// this allows us to accept our prisma client
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

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