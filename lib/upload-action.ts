"use server"

import AdmZip from "adm-zip";
import { prisma } from './prisma';
import { getSession } from "./session";
import fs from 'fs';

export async function uploadGame(formData: FormData) {
    const name = formData.get("gamename") as string;
    const description = formData.get("description") as string;
    const file = formData.get("file") as File;

    // verify that all required fields are provided
    if (!name || !description) throw new Error("Name and description are required.");
    if (!file) throw new Error("No game files uploaded");
    if (!file.name.endsWith(".zip")) throw new Error("Only ZIP files are allowed.");

    // TODO: Move declaration to .env file
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File is too large. Maximum allowed size is ${MAX_FILE_SIZE / (1024 * 1024)} MB.`);
    }

    // find uploader info
    const session = await getSession();
    if (!session) throw new Error("Failed to validate user session.");
    const user = await prisma.user.findUnique({
        where: {
            name: session.username
        }
    })
    if (!user || !user.id) throw new Error("Failed to find user");

    const gamePathOnDisk = `public/games/${user.id}/${name}`;

    let game;
    // (try to) create DB entry for the game
    try {
        game = await prisma.game.create({
            data: { 
                name: name, 
                description: description,
                extractedPath: gamePathOnDisk,
                zipPath: "not important",
                userId: user.id
            }
        });
    } catch (e) {
        throw new Error("Failed to create game");
    }

    // Extract game files to disk
    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const zip = new AdmZip(buffer);
        zip.extractAllTo(gamePathOnDisk);
    } catch (e) {
        // cleanup DB entry and possibly extracted files
        await prisma.game.delete({where: {id: game.id}});
        fs.rmSync(gamePathOnDisk, { recursive: true, force: true });

        throw new Error("Failed to extract ZIP file.");
    }


    console.log(`User uploaded: ${name} ${description} ${file.name}`);
}