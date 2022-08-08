import { createRouter } from "./context";

export const fixtureRouter = createRouter().query("getAll", {
    async resolve({ ctx }) {
        return await ctx.prisma.fixture.findMany({
            include: {
                home: true,
                away: true,
            },
        });
    },
});
