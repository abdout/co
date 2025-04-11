// This is a workaround for Next.js trying to import from .prisma/client/default
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prisma = exports.PrismaClient = void 0;
var prismaClient = require("@prisma/client");
Object.defineProperty(exports, "PrismaClient", { enumerable: true, get: function () { return prismaClient.PrismaClient; } });
Object.defineProperty(exports, "Prisma", { enumerable: true, get: function () { return prismaClient.Prisma; } }); 