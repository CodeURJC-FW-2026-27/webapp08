import fs from 'node:fs/promises';
import * as board from './board.js';

const UPLOADS_FOLDER = './uploads';
const DATA_FOLDER = './data';
import { ObjectId } from 'mongodb';

let dataFile = 'data.json';

const dataString = await fs.readFile(DATA_FOLDER + '/' + dataFile, 'utf8');

const drivers = JSON.parse(dataString);

await board.deleteDrivers();
for (let driver of drivers) {
    if (driver.trips) {
        driver.trips = driver.trips.map(trip => ({
            _id: new ObjectId(),
            ...trip
        }));
    }
    await board.addDriver(driver);
}

await fs.rm(UPLOADS_FOLDER, { recursive: true, force: true });
await fs.mkdir(UPLOADS_FOLDER);
await fs.cp(DATA_FOLDER + '/images', UPLOADS_FOLDER, { recursive: true });

console.log('Demo data loaded');