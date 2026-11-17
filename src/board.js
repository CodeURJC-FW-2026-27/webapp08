import { MongoClient, ObjectId } from 'mongodb';
import fs from 'node:fs/promises';

const MONGO_URL = 'mongodb://localhost:27017';
const DB_NAME = 'webapp08';
const DATA_FOLDER = './data';

export const UPLOADS_FOLDER = './uploads';

const client = new MongoClient(MONGO_URL);
const db = client.db(DB_NAME);
const drivers = db.collection('drivers');
const trips = db.collection('trips');



function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* ---------- Demo data ---------- */

// Inserts the demo data from ./data/data.json only if the database is empty
export async function loadDemoData() {
    await client.connect();

    if (await drivers.countDocuments() > 0) {
        return;
    }

    const data = JSON.parse(await fs.readFile(`${DATA_FOLDER}/data.json`, 'utf8'));

    // Each driver in the JSON can have a nested "trips" array: it goes to its own collection
    const driversData = data.map(({ trips, ...driver }) => driver);
    const result = await drivers.insertMany(driversData);

    const tripsData = data.flatMap((driver, i) =>
        (driver.trips ?? []).map(trip => ({ ...trip, driverId: result.insertedIds[i] })));
    if (tripsData.length > 0) {
        await trips.insertMany(tripsData);
    }

    // Demo images -> uploads folder
    await fs.mkdir(UPLOADS_FOLDER, { recursive: true });
    await fs.cp(`${DATA_FOLDER}/images`, UPLOADS_FOLDER, { recursive: true }).catch(() => {});

    console.log('Demo data loaded');
}

/* ---------- Drivers (main entity) ---------- */

export async function addDriver(driver) {
    return await drivers.insertOne(driver);
}

export async function getDriver(id) {
    return await drivers.findOne({ _id: new ObjectId(id) });
}

export async function getDriverByName(name) {
    return await drivers.findOne({
        name: { $regex: `^${escapeRegex(name)}$`, $options: 'i' }
    });
}

// Returns one page of drivers, optionally filtered by vehicle type and/or name
export async function getDrivers({ vehicle, search, page = 1, limit = 6 } = {}) {
    const query = {};
    if (vehicle) {
        query.vehicle = vehicle;
    }
    if (search) {
        query.name = { $regex: escapeRegex(search), $options: 'i' };
    }

    const total = await drivers.countDocuments(query, { collation: COLLATION });
    const items = await drivers.find(query, { collation: COLLATION })
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray();

    return { drivers: items, totalPages: Math.ceil(total / limit) };
}

export async function updateDriver(id, driver) {
    return await drivers.updateOne({ _id: new ObjectId(id) }, { $set: driver });
}

// Deleting a driver also deletes its trips
export async function deleteDriver(id) {
    await trips.deleteMany({ driverId: new ObjectId(id) });
    return await drivers.findOneAndDelete({ _id: new ObjectId(id) });
}

/* ---------- Trips (secondary entity) ---------- */

export async function addTrip(driverId, trip) {
    return await trips.insertOne({ ...trip, driverId: new ObjectId(driverId) });
}

export async function getTrip(id) {
    return await trips.findOne({ _id: new ObjectId(id) });
}

export async function getTripsByDriver(driverId) {
    return await trips.find({ driverId: new ObjectId(driverId) }).toArray();
}

export async function updateTrip(id, trip) {
    return await trips.updateOne({ _id: new ObjectId(id) }, { $set: trip });
}

export async function deleteTrip(id) {
    return await trips.findOneAndDelete({ _id: new ObjectId(id) });
}
