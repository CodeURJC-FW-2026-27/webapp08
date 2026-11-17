import express from 'express';
import { MongoClient,ObjectId } from 'mongodb';


const router = express.Router();
export default router;

const client = new MongoClient('mongodb://localhost:27017');

const db = client.db('CarMe');
const drivers = db.collection('drivers');

export const UPLOADS_FOLDER = './uploads';

export async function addDriver(driver) {

    return await drivers.insertOne(driver);
}

export async function deleteDriver(id){

    return await drivers.findOneAndDelete({ _id: new ObjectId(id) });
}

export async function deleteDriver(){

    return await drivers.deleteMany();
}

//export async function getDrivers(){

 //   return await drivers.find().toArray();
//}

export async function getDriver(id){

    return await drivers.findOne({ _id: new ObjectId(id) });
}

export async function getDriverByName(name) {
    return await drivers.findOne({
        name: { $regex: `^${escapeRegex(name)}$`, $options: 'i' }
    });
}




function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}





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