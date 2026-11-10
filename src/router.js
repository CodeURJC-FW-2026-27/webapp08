import express from 'express';
import multer from 'multer';

const router = express.Router();
export default router;

const upload = multer({ dest: 'uploads/' });

router.get('/', (req, res) => {
    const db = req.app.locals.db;
    const driversCollection = db.collection('drivers');


    const tipo = req.query.tipo;
    const search = req.query.search;
    let query = {};
    if (tipo) {
        query.vehiculo = tipo;
    }

    if (search) {
        query.nombre = { $regex: search, $options: 'i' };
    }
    const limit = 6; 
    const page = parseInt(req.query.page) || 1; 
    const skip = (page - 1) * limit;

    driversCollection.countDocuments(query, function(err, totalDocs) {
        if (err) return res.status(500).send("Error al contar documentos");

        const totalPages = Math.ceil(totalDocs / limit);

        driversCollection.find(query).skip(skip).limit(limit).toArray(function(err, docs) {
            if (err) return res.status(500).send("Error al buscar documentos");

            const prevPage = page > 1 ? page - 1 : null;
            const nextPage = page < totalPages ? page + 1 : null;
            
            let pagesArray = [];
            for (let i = 1; i <= totalPages; i++) {
                pagesArray.push({
                    pageNumber: i,
                    isCurrent: i === page,
                    tipo: tipo 
                });
            }

            res.render('main', {
                pageTittle: 'Welcome - CarMe',
                filtro: docs,
                prevPage: prevPage,
                nextPage: nextPage,
                pages: pagesArray,
                tipo: tipo
            });
        });
    });
});

router.get('/newdriver', (req, res) => {
    res.render('newdriver', {
        pageTittle: 'New driver - CarMe'
    });
});

router.get('/detail', (req, res) => {
    res.render('detail', {
        pageTittle: 'Driver information - CarMe'
    });
});

router.post('/newdriver', upload.single('image'), async (req, res) => {
    const db = req.app.locals.db;
    const driversCollection = db.collection('drivers');

    const newDriver = {
        name: req.body.DriverName,
        community: req.body.AutonomousComunity,
        vehicle: req.body.Cartype,
        puntuation: parseFloat(req.body.Punctuation) || 0,
        experience: parseInt(req.body.Experience) || 0,
        availabeSpots: parseInt(req.body.AvailableSpots) || 1,
        availability: req.body.Availability === 'on',
        imageFileName: req.file ? req.file.filename : null
    };

    try {
        await driversCollection.insertOne(newDriver);
        res.redirect('/');
    } catch (error) {
        console.error("Error inserting the new driver:", error);
        res.status(500).send("Error while inserting the new driver on the database");
    }
});