import { prisma } from "../lib/prisma";

async function main() {
  // Create a new user with a post
  const user = await prisma.user.create({
    data: {
      name: "Jairo",
      email: "jairomsanchez@gmail.com",
      password: "324dgdg"
    },
  });
  console.log("Created user:", user);

  /*
  const user = await prisma.user.update({
    where: {
        id:1
    },
        data: {
          name: "Jania", 
          email: "janiamsanchez@gmail.com", 
          password: "caboverde589"
        }
    ,
  });
  console.log("user actualizado", user );*/

  const delete_user = await prisma.user.delete({
    where:{ email: "janiamsanchez@gmail.com"}
  });
  console.log("user deleted", delete_user);
  
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });