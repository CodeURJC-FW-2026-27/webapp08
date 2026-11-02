import express from 'express';

const router = express.Router();
export default router;

router.get('/', (req, res) => {
    const db = req.app.locals.db;
    const driversCollection = db.collection('drivers');

    const tipo = req.query.tipo;
    let query = {};
    if (tipo) {
        query = { vehiculo: tipo };
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
    res.render('newdriver', {});
});

router.get('/detail', (req, res) => {
    res.render('detail', {});
});