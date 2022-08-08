import {
    scrapePremierLeague,
    updateScore,
} from "../scripts/premierLeagueScraper";
import { createClubDict, seed, seedClubs } from "../scripts/seeder";
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
    })
    .mutation("scrapePremierLeague", {
        async resolve({ ctx }) {
            console.log("Request");
            const fixtures = await scrapePremierLeague(ctx.prisma);
            if (!fixtures) {
                return;
            }
            const clubDict = await createClubDict(ctx.prisma, true);
            const competition = await ctx.prisma.competition.findFirst({
                where: {
                    name: "Premier League",
                },
            });
            if (!competition) {
                return;
            }
            console.log("Starting", fixtures);
            await Promise.all(
                fixtures.map(async (fixture) => {
                    await updateScore(
                        ctx.prisma,
                        clubDict,
                        fixture,
                        competition.id
                    );
                })
            );
            console.log("Done");
            return;
        },
    });
