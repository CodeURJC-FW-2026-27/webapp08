import express from 'express';
import { MongoClient,ObjectId } from 'mongodb';


const router = express.Router();
export default router;

const client = new MongoClient('mongodb://localhost:27017');

const db = client.db('CarMe');
const drivers = db.collection('drivers');
const COLLATION = { locale: 'es', strength: 1 };
const trips = db.collection('trips');

export const UPLOADS_FOLDER = './uploads';

export async function addDriver(driver) {

    return await drivers.insertOne(driver);
}

export async function deleteDriver(id){

    return await drivers.findOneAndDelete({ _id: new ObjectId(id) });
}

export async function deleteDrivers(){

    return await drivers.deleteMany();
}

export async function getDrivers(){

    return await drivers.find().toArray();
}

export async function getDriver(id){

    return await drivers.findOne({ _id: new ObjectId(id) });
}

export async function getDriverByName(name) {
    return await drivers.findOne({
        name: { $regex: `^${escapeRegex(name)}$`, $options: 'i' }
    });
}

export async function updateDriver(driver) {
    const { id, ...fieldsToUpdate } = driver;
    return await drivers.updateOne(
        { _id: new ObjectId(id) },
        { $set: fieldsToUpdate }
    );
}



//--------------Trips----------------


export async function addTrip(driverId, trip) {
    const newTrip = { _id: new ObjectId(), ...trip };
    return await drivers.updateOne(
        { _id: new ObjectId(driverId) },
        { $push: { trips: newTrip } }
    );
}


export async function getTripsByDriverId(driverId) {
    const driver = await drivers.findOne({ _id: new ObjectId(driverId) });
    return driver?.trips ?? [];
}


export async function getTrip(tripId) {
    const driver = await drivers.findOne(
        { 'trips._id': new ObjectId(tripId) },
        { projection: { 'trips.$': 1 } }
    );
    return driver?.trips?.[0] ?? null;
}


export async function deleteTrip(driverId, tripId) {
    return await drivers.updateOne(
        { _id: new ObjectId(driverId) },
        { $pull: { trips: { _id: new ObjectId(tripId) } } }
    );
}

export async function updateTrip(driverId, tripId, updatedFields) {
    const tripIdFilter = ObjectId.isValid(tripId)
    ? { $in: [new ObjectId(tripId), tripId] } : tripId;

    return await drivers.updateOne(
        { _id: new ObjectId(driverId), 'trips._id': tripIdFilter },
        {
            $set: {
                'trips.$.title': updatedFields.title,
                'trips.$.origin': updatedFields.origin,
                'trips.$.destination': updatedFields.destination,
                'trips.$.dateHour': updatedFields.dateHour,
                'trips.$.price': updatedFields.price,
                'trips.$.intercommunity': updatedFields.intercommunity,
                'trips.$.image': updatedFields.image
            }
        }
    );
}

function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}




export async function getDriversPaginated({ vehicle, search, page = 1, limit = 6 } = {}) {
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