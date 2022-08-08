import { createRouter } from "./context";

export const clubRouter = createRouter().query("getAll", {
    async resolve({ ctx }) {
        return await ctx.prisma.club.findMany();
    },
});
