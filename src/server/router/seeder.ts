import { seed, seedClubs } from "../scripts/seeder";
import { createRouter } from "./context";

export const seederRouter = createRouter()
    .mutation("clubs", {
        async resolve({ ctx }) {
            return await seedClubs(ctx.prisma);
        },
    })
    .mutation("all", {
        async resolve({ ctx }) {
            return await seed(ctx.prisma);
        },
    })
    .mutation("deleteAll", {
        async resolve({ ctx }) {
            await ctx.prisma.club.deleteMany();
            await ctx.prisma.fixture.deleteMany();
            await ctx.prisma.competition.deleteMany();
        },
    });
