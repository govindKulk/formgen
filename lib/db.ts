import PrismaClient from "@prisma/client";



declare global {
   var prisma : PrismaClient.PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient.PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}


export default prisma;

