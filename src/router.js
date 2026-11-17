import express from 'express';
import multer from 'multer';
import * as board from './board.js';
import fs from 'node:fs/promises';

const router = express.Router();
export default router;

const upload = multer({ dest: 'uploads/' });

async function validateDriver(body, isEdit, currentID) {
    const name = body.DriverName ? body.DriverName.trim() : '';
    const community = body.AutonomousComunity;
    const cartype = body.Cartype;
    const punctuation = parseFloat(body.puntuation);
    const experience = parseInt(body.experience);
    const availableSpots = parseInt(body.AvailableSpots);

    if (!name || !community || !cartype || isNaN(punctuation) || isNaN(experience) || isNaN(availableSpots)) {
        return "All fields are required and must be valid.";
    }
    if (name.length < 3 || name.length > 50) {
        return "The name must be between 3 and 50 characters long.";
    }
    if (!/^[A-ZÁÉÍÓÚÑ]/.test(name)) {
        return "The name must start with a capital letter.";
    }
    if (isNaN(punctuation) || punctuation < 0 || punctuation > 5) {
        return "Punctuation must be a number between 0 and 5.";
    }
    if (isNaN(experience) || experience < 0) {
        return "Experience must be a non-negative number.";
    }
    if (isNaN(availableSpots) || availableSpots < 1 || availableSpots > 8) {
        return "Available spots must be a number between 1 and 8.";
    }

    // Check for duplicate names
    const duplicate = await board.getDriversByName(name);

    if (duplicate) {
        const duplicateId = duplicate._id ? duplicate._id.toString() : duplicate.id;
        if (!isEdit || duplicateId !== currentID) {
            return "A driver with this name already exists.";
        }
    }
    return null; // No validation errors
}

router.get('/', (req, res) => {
    const db = req.app.locals.db;
    const driversCollection = db.collection('drivers');


    const tipo = req.query.tipo;
    const search = req.query.search;
    let query = {};
    if (tipo) {
        query.vehicle = tipo;
    }

    if (search) {
        query.name = { $regex: search, $options: 'i' };
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

router.get('/editdriver/:id', async (req, res) => {
    try {
        const driver = await board.getDriver(req.params.id);

        if (!driver) {
            return res.status(404).render('error', {
                pageTittle: 'Error - CarMe',
                message: 'Driver not found.',
                backUrl: '/',
                buttonText: 'Go back to main page'
            });
        }

        driver._id = driver._id || driver.id;

        res.render('newdriver', {
            pageTittle: 'Edit driver - CarMe',
            driver: driver,
            selectedCommunity: {[driver.community]: true},
            selectedVehicle: {[driver.vehicle]: true}
        });
    } catch (error) {
        console.error('Error loading driver:', error);
        res.status(500).render('error', {
            pageTittle: 'Error - CarMe',
            message: 'An error occurred while loading the driver data. Please try again later.',
            backUrl: '/',
            buttonText: 'Go back to main page'
        });
    }
});

router.get('/detail', (req, res) => {
    res.render('detail', {
        pageTittle: 'Driver information - CarMe'
    });
});

router.post('/newdriver', upload.single('image'), async (req, res) => {
    const isEdit = Boolean(req.body.driverId);
    const currentID = req.body.driverId;

    try {
        const validationError = await validateDriver(req.body, isEdit, currentID);

        if (validationError) {
            if (req.file) {
                await fs.unlink(req.file.path);
            }

            const backUrl = isEdit ? `/editdriver/${currentID}` : '/newdriver';
            return res.status(400).render('error', {
                pageTittle: 'Error - CarMe',
                message: validationError,
                backUrl: backUrl,
                buttonText: 'Go back to form'
            });
        }

        let finalImageFilename = null;
        if (req.file) {
            finalImageFilename = req.file.filename;
        } else if (isEdit && req.body.oldImage) {
            finalImageFilename = req.body.oldImage;
        }

        const driverData = {
            name: req.body.DriverName.trim(),
            community: req.body.AutonomousComunity,
            vehicle: req.body.Cartype,
            puntuation: parseFloat(req.body.puntuation),
            experience: parseInt(req.body.experience),
            availableSpots: parseInt(req.body.AvailableSpots),
            availability: req.body.Availability === 'on',
            imageFilename: finalImageFilename
        };

        if (isEdit) {
            driverData.id = currentID;
            await board.updateDriver(driverData);
            return res.render('confirmation', {
                pageTittle: 'Conductor actualizado - CarMe',
                message: 'El conductor ha sido actualizado con éxito.',
                nextUrl: `/detail?id=${currentID}`,
                buttonText: 'Ver detalle del conductor'
            });
        } else {
            const createdId = await board.addDriver(driverData);
            const targetId = createdId || driverData.id;
            return res.render('confirmation', {
                pageTittle: 'Conductor creado - CarMe',
                message: 'El conductor ha sido creado con éxito.',
                nextUrl: `/detail?id=${targetId}`,
                buttonText: 'Ver detalle del conductor'
            });
        }

    } catch (error) {
        console.error('Error processing driver data:', error);
        if (req.file) {
            await fs.unlink(req.file.path);
        }
        res.status(500).render('error', {
            pageTittle: 'Error del servidor - CarMe',
            message: 'Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.',
            backUrl: isEdit ? `/editdriver/${currentID}` : '/newdriver',
            buttonText: 'Volver al formulario'
        });
    }
});     