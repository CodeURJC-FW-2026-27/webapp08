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

    // Lógica de Paginación
    const limit = 6; // 6 elementos por página según enunciado
    const page = parseInt(req.query.page) || 1; // Página actual, por defecto 1
    const skip = (page - 1) * limit;

    // Primero contamos el total de documentos para saber cuántas páginas hay
    driversCollection.countDocuments(query, function(err, totalDocs) {
        if (err) return res.status(500).send("Error al contar documentos");

        const totalPages = Math.ceil(totalDocs / limit);

        // Segundo, buscamos los documentos con limit y skip
        driversCollection.find(query).skip(skip).limit(limit).toArray(function(err, docs) {
            if (err) return res.status(500).send("Error al buscar documentos");

            // Preparar las variables para Mustache
            const prevPage = page > 1 ? page - 1 : null;
            const nextPage = page < totalPages ? page + 1 : null;
            
            // Generar array de páginas para renderizar los números de abajo (1, 2, [3], 4...)
            let pagesArray = [];
            for (let i = 1; i <= totalPages; i++) {
                pagesArray.push({
                    pageNumber: i,
                    isCurrent: i === page,
                    tipo: tipo // Se pasa el tipo para no perder el filtro al cambiar de página
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