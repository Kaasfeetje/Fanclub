import { Club, PrismaClient } from "@prisma/client";
import puppeteer from "puppeteer";
import { plClubs } from "./seeder";

export const scrapePremierLeague = async (prisma: PrismaClient) => {
    const browser = await puppeteer.launch({});
    const page = await browser.newPage();

    await page.goto("https://www.premierleague.com/results");

    await page.waitForSelector(".fixtures__matches-list");
    const selector = ".fixtures__matches-list .matchList .overview .teams";
    const fixtureTexts = await page.$$eval(
        `${selector} .abbr, ${selector} .score`,
        (fixtures) => {
            return fixtures.map((fixture) => fixture.textContent);
        }
    );

    await browser.close();

    const fixtures: { home: string; away: string; score: string }[] = [];
    for (let i = 0; i < fixtureTexts.length; i += 3) {
        if (
            fixtureTexts[i] === null ||
            fixtureTexts[i + 1] === null ||
            fixtureTexts[i + 2] === null
        ) {
            return;
        }
        fixtures.push({
            home: fixtureTexts[i]!,
            away: fixtureTexts[i + 2]!,
            score: fixtureTexts[i + 1]!,
        });
    }

    return fixtures;
};

export const updateScore = async (
    prisma: PrismaClient,
    clubDict: { [name: string]: Club },
    fixture: { home: string; away: string; score: string },
    competitionId: string
) => {
    const home = clubDict[fixture.home];
    const away = clubDict[fixture.away];

    if (!home || !away) {
        console.log(home, away);
        return;
    }

    const score = fixture.score.split("-");
    if (!score || score.length < 2) {
        return;
    }

    const prevFixture = await prisma.fixture.findUnique({
        where: {
            homeId_awayId_competitionId: {
                homeId: home.id,
                awayId: away.id,
                competitionId,
            },
        },
        include: { score: true },
    });

    if (!prevFixture || prevFixture.score) {
        return;
    }

    await prisma.fixture.update({
        where: {
            homeId_awayId_competitionId: {
                homeId: home.id,
                awayId: away.id,
                competitionId,
            },
        },
        data: {
            score: {
                create: {
                    home: parseInt(score[0]!),
                    away: parseInt(score[1]!),
                },
            },
        },
    });
};
