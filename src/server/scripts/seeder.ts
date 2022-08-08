import { Club, PrismaClient } from "@prisma/client";
import fs from "fs";
import { number } from "zod";
import plFixtures from "../data/pl-fixtures.json";

const createPremierLeague = async (prisma: PrismaClient) => {
    const clubs = await addPlClubs(prisma);
    const competition = await prisma.competition.create({
        data: {
            country: "England",
            name: "Premier League",
            clubs: { connect: clubs.map((club) => ({ id: club.id })) },
            year: 2022,
        },
    });
    await addPlFixtures(prisma, clubs, competition.id);
};

export const plClubs = [
    { name: "Arsenal", abbr: "ARS" },
    { name: "Aston Villa", abbr: "AVL" },
    { name: "Bournemouth", abbr: "BOU" },
    { name: "Brentford", abbr: "BRE" },
    { name: "Brighton & Hove Albion", abbr: "BHA" },
    { name: "Chelsea", abbr: "CHE" },
    { name: "Crystal Palace", abbr: "CRY" },
    { name: "Everton", abbr: "EVE" },
    { name: "Fulham", abbr: "FUL" },
    { name: "Leeds United", abbr: "LEE" },
    { name: "Leicester City", abbr: "LEI" },
    { name: "Liverpool", abbr: "LIV" },
    { name: "Manchester City", abbr: "MCI" },
    { name: "Manchester United", abbr: "MUN" },
    { name: "Newcastle United", abbr: "NEW" },
    { name: "Nottingham Forest", abbr: "NFO" },
    { name: "Southampton", abbr: "SOU" },
    { name: "Tottenham Hotspur", abbr: "TOT" },
    { name: "West Ham United", abbr: "WHU" },
    { name: "Wolverhampton Wanderers", abbr: "WOL" },
];

const addPlClubs = async (prisma: PrismaClient) => {
    try {
        await prisma.club.createMany({
            data: plClubs.map((club) => {
                return { name: club.name, abbr: club.abbr };
            }),
        });
    } catch (err: any) {
        console.log(err);
    }

    const clubs = await prisma.club.findMany({
        where: {
            name: { in: plClubs.map((c) => c.name) },
        },
    });

    return clubs;
};

const addPlFixtures = async (
    prisma: PrismaClient,
    clubs: Club[],
    competitionId: string
) => {
    const clubDict = await createClubDict(prisma, false, clubs);

    await prisma.fixture.createMany({
        data: plFixtures.map((fixture) => {
            const home = clubDict[fixture.home];
            const away = clubDict[fixture.away];

            return {
                homeId: home!.id,
                awayId: away!.id,
                competitionId,
                date:
                    fixture.date === "TBD"
                        ? undefined
                        : new Date(fixture.date).toJSON(),
            };
        }),
    });
};

export const seedClubs = async (prisma: PrismaClient) => {
    const clubs = await addPlClubs(prisma);
    return clubs;
};

export const seed = async (prisma: PrismaClient) => {
    const pl = await createPremierLeague(prisma);
};

export const createClubDict = async (
    prisma: PrismaClient,
    isAbbr: boolean,
    clubs?: Club[]
) => {
    if (!clubs) {
        clubs = await prisma.club.findMany({
            where: {
                competitions: {
                    some: {
                        name: "Premier League",
                    },
                },
            },
        });
    }

    const clubDict: { [name: string]: Club } = {};
    clubs.forEach((club) => (clubDict[isAbbr ? club.abbr : club.name] = club));
    return clubDict;
};
