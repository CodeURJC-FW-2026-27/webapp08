import express from 'express'; 
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const client = new MongoClient('mongodb://localhost:27017'); 
let db, driversCollection;

async function initDB() {
    await client.connect();
    db = client.db('carme');
    driversCollection = db.collection('drivers');
    await driversCollection.createIndex({ name: 'text' }); 
}
initDB();


router.post('/newdriver', async (req, res) => {
    res.status(201).redirect('/main.html'); 
});

router.get('/main', async (req, res) => {
    try {
        const { search, page } = req.query;
        let query = {};

        if (search) {
            query = { $text: { $search: search } }; 
        }

        const pageSize = 6; 
        const numPage = parseInt(page, 10) || 1; 

        const drivers = await driversCollection.find(query) 
            .skip((numPage - 1) * pageSize) 
            .limit(pageSize) 
            .toArray();

        const totalElements = await driversCollection.countDocuments(query);
        const totalPages = Math.ceil(totalElements / pageSize);

        const htmlPath = path.join(__dirname, '../public/main.html');
        let htmlContent = fs.readFileSync(htmlPath, 'utf-8');

        let driversHtml = '';
        drivers.forEach(driver => {
            driversHtml += `
                <div class="col-12 col-sm-6 col-lg-4">
                    <div class="driver-card card">
                        <h3 class="display-6">${driver.name}</h3>
                        <a href="detail.html"><img src="${driver.imagePath || '../public/images/default.jpg'}" alt="${driver.name}"></a>
                        <ul class="list-unstyled">
                            <li><strong>Disponibilidad:</strong> ${driver.isAvailable ? 'Sí' : 'No'}</li>
                            <li><strong>Plazas:</strong> ${driver.spots || 0}</li>
                            <li><strong>Puntuación:</strong> ${driver.puntuation || 0}/5</li>
                            <li><strong>Vehículo:</strong> ${driver.carType}</li>
                        </ul>
                    </div>
                </div>`;
        });

        const prevPage = numPage > 1 ? `/api/drivers/main?page=${numPage - 1}` : '#';
        const nextPage = numPage < totalPages ? `/api/drivers/main?page=${numPage + 1}` : '#';
        
        let paginationHtml = `
            <div class="d-flex justify-content-center mt-4 w-100">
                <a href="${prevPage}" class="btn btn-outline-dark me-2 ${numPage === 1 ? 'disabled' : ''}">Anterior</a>
                <span class="mx-3 align-self-center">Página ${numPage} de ${totalPages || 1}</span>
                <a href="${nextPage}" class="btn btn-outline-dark ${numPage >= totalPages ? 'disabled' : ''}">Siguiente</a>
            </div>`;

        
        htmlContent = htmlContent.replace(
            '<div class="row g-4" id="drivers-container"></div>', 
            `<div class="row g-4" id="drivers-container">${driversHtml}${paginationHtml}</div>`
        );

        res.send(htmlContent);

    } catch (error) {
        console.error("Error al renderizar la página:", error);
        res.status(500).send("Error del servidor");
    }
});

export default router; 