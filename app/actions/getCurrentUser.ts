import { PrismaClient } from "@prisma/client";
import getSession from "./getSession";

const prisma = new PrismaClient();

const getCurrentUser = async () => {
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      return null;
    }
    const currentUser = await prisma.user.findUnique({
        where: {
            email: session.user.email as string
        }
    });
    if(!currentUser) {
        console.log('no session or user or email')

        return null;
    }

    return currentUser
  } catch (error) {
    console.log(error);
  }
};

export default getCurrentUser;