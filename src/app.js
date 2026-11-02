import express from 'express';
import mustacheExpress from 'mustache-express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import fs from 'fs';

import router from './router.js';

const app = express();

app.use(express.static('./public'));

app.set('view engine', 'html');
app.engine('html', mustacheExpress(), ".html");
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: true }));

// Leer los archivos JSON actualizados
const driversData = JSON.parse(fs.readFileSync('./data/drivers.json', 'utf8'));
const tripsData = JSON.parse(fs.readFileSync('./data/trips.json', 'utf8'));

const url = 'mongodb://localhost:27017';
const dbName = 'webapp08';

MongoClient.connect(url, function(err, client) {
    if (err) {
        console.error("Error conectando a MongoDB:", err);
        return;
    }
    console.log("Conectado con éxito a la base de datos");
    
    const db = client.db(dbName);
    app.locals.db = db;

    const driversCollection = db.collection('drivers');
    const tripsCollection = db.collection('trips');

    // BORRAR los datos antiguos y REINSERTAR los nuevos
    driversCollection.deleteMany({}, function(err) {
        if (err) console.error("Error borrando drivers:", err);
        driversCollection.insertMany(driversData, function(err, result) {
            if (err) console.error("Error insertando drivers:", err);
            console.log("Datos de conductores actualizados desde el JSON.");
        });
    });

    tripsCollection.deleteMany({}, function(err) {
        if (err) console.error("Error borrando trips:", err);
        tripsCollection.insertMany(tripsData, function(err, result) {
            if (err) console.error("Error insertando trips:", err);
            console.log("Datos de actividades actualizados desde el JSON.");
        });
    });

    app.use('/', router);

    app.listen(3000, () => console.log('Web ready in http://localhost:3000/'));
});