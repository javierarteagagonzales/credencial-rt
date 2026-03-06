import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

const g = global as unknown as {
  prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
}

const prisma = g.prismaGlobal ?? prismaClientSingleton()

export { prisma }

if (process.env.NODE_ENV !== 'production') g.prismaGlobal = prisma
