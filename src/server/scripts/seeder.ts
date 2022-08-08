import { Club, PrismaClient } from "@prisma/client";
import fs from "fs";
import plFixtures from "../data/pl-fixtures.json";

const createPremierLeague = async (prisma: PrismaClient) => {
    const clubs = await addPlClubs(prisma);
    console.log("AAA");
    const competition = await prisma.competition.create({
        data: {
            country: "England",
            name: "Premier League",
            clubs: { connect: clubs.map((club) => ({ id: club.id })) },
            year: 2022,
        },
    });
    console.log("BBB");
    const plFixtures = await addPlFixtures(prisma, clubs, competition.id);
    console.log("CCC");
};

const addPlClubs = async (prisma: PrismaClient) => {
    const plClubs = [
        "Arsenal",
        "Aston Villa",
        "Bournemouth",
        "Brentford",
        "Brighton & Hove Albion",
        "Chelsea",
        "Crystal Palace",
        "Everton",
        "Fulham",
        "Leeds United",
        "Leicester City",
        "Liverpool",
        "Manchester City",
        "Manchester United",
        "Newcastle United",
        "Nottingham Forest",
        "Southampton",
        "Tottenham Hotspur",
        "West Ham United",
        "Wolverhampton Wanderers",
    ];

    try {
        await prisma.club.createMany({
            data: plClubs.map((club) => {
                return { name: club };
            }),
        });
    } catch (err: any) {}

    const clubs = await prisma.club.findMany({
        where: {
            name: { in: plClubs },
        },
    });

    return clubs;
};

const addPlFixtures = async (
    prisma: PrismaClient,
    clubs: Club[],
    competitionId: string
) => {
    const clubDict: { [name: string]: Club } = {};
    clubs.forEach((club) => (clubDict[club.name] = club));

    const fixtures = await prisma.fixture.createMany({
        data: plFixtures.map((fixture) => {
            const home = clubDict[fixture.home];
            const away = clubDict[fixture.away];
            console.log(fixture.home, home);
            console.log(fixture.away, away);

            return {
                homeId: home!.id,
                awayId: away!.id,
                competitionId,
                date: new Date(fixture.date).toJSON(),
            };
        }),
    });
    console.log(fixtures);
};

export const seedClubs = async (prisma: PrismaClient) => {
    const clubs = await addPlClubs(prisma);
    return clubs;
};

export const seed = async (prisma: PrismaClient) => {
    const pl = await createPremierLeague(prisma);
};
