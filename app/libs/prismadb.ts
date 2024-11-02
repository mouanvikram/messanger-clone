import { PrismaClient } from "@prisma/client";

declare global {
    // Prevent multiple instances of PrismaClient in development
    // by adding it to the global scope
    var prisma: PrismaClient | undefined;
}

const client = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    global.prisma = client;
}

export default client;
