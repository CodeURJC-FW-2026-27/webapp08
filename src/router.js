import express from 'express';
import multer from 'multer';
import * as board from './board.js';
import fs from 'node:fs/promises';
import path from 'node:path';

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
    const duplicate = await board.getDriverByName(name);

    if (duplicate) {
        const duplicateId = duplicate._id ? duplicate._id.toString() : duplicate.id;
        if (!isEdit || duplicateId !== currentID) {
            return "A driver with this name already exists.";
        }
    }
    return null; // No validation errors
}





// Validates a text field of a trip (title, origin, destination)
function validateTripText(value, label) {
    if (value.length < 3 || value.length > 100) {
        return `The ${label} must be between 3 and 100 characters long.`;
    }
    if (!/^[A-ZÁÉÍÓÚÑ]/.test(value)) {
        return `The ${label} must start with a capital letter.`;
    }
    return null;
}

// Converts "2026-11-20T09:00" (datetime-local) to "20/11/2026 09:00" (format used in the data)
function formatDateHour(value) {
    const [date, time] = value.split('T');
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year} ${time}`;
}

function validateTrip(body, driver, file) {
    const title = body.tripTitle ? body.tripTitle.trim() : '';
    const origin = body.tripOrigin ? body.tripOrigin.trim() : '';
    const destination = body.tripDestination ? body.tripDestination.trim() : '';
    const dateTime = body.tripDateTime;
    const price = parseFloat(body.tripPrice);

    if (!title || !origin || !destination || !dateTime || isNaN(price)) {
        return "All fields are required and must be valid.";
    }

    const textError = validateTripText(title, 'title')
        || validateTripText(origin, 'origin')
        || validateTripText(destination, 'destination');
    if (textError) {
        return textError;
    }
    if (origin.toLowerCase() === destination.toLowerCase()) {
        return "The origin and the destination must be different.";
    }

    const date = new Date(dateTime);
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dateTime) || isNaN(date.getTime())) {
        return "The date and time are not valid.";
    }
    if (date <= new Date()) {
        return "The date and time must be in the future.";
    }

    if (price < 0 || price > 500) {
        return "Price must be a number between 0 and 500.";
    }
    if (!file) {
        return "A cover photo is required.";
    }

    // Check for duplicate trips of the same driver
    const formattedDate = formatDateHour(dateTime);
    const duplicate = (driver.trips || []).some(trip =>
        trip.origin.toLowerCase() === origin.toLowerCase() &&
        trip.destination.toLowerCase() === destination.toLowerCase() &&
        trip.dateHour === formattedDate);
    if (duplicate) {
        return "This driver already has a trip with the same origin, destination and date.";
    }
    return null; // No validation errors
}















router.get('/', async (req, res) => {

    const tipo = req.query.tipo;
    const search = req.query.search;
    const page = parseInt(req.query.page) || 1;

    const { drivers, totalPages } = await board.getDriversPaginated({
        vehicle: tipo,
        search,
        page
    });

    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;

    const pagesArray = [];
    for (let i = 1; i <= totalPages; i++) {
        pagesArray.push({
            pageNumber: i,
            isCurrent: i === page,
            tipo: tipo,
            search: search
        });
    }

    res.render('main', {
        pageTittle: 'Welcome - CarMe',
        filtro: drivers,
        prevPage: prevPage,
        nextPage: nextPage,
        pages: pagesArray,
        tipo: tipo,
        search: search
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
            return res.status(404).render('confirmation', {
                pageTittle: 'Error - CarMe',
                message: 'Driver not found.',
                backUrl: '/',
                buttonText: 'Go back to main page'
            });
        }

        driver._id = driver._id ? driver._id.toString() : driver.id;

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








router.get('/detail/:id', async (req, res) => {
    const driverId = req.params.id;

    if (!driverId) {
        return res.status(400).render('confirmation', {
            pageTittle: 'Error - CarMe',
            message: 'Driver ID is required.',
            backUrl: '/',
            buttonText: 'Go back to main page'
        });
    }

    try {
        const driver = await board.getDriver(driverId);

        if (!driver) {
            return res.status(404).render('confirmation', {
                pageTittle: 'Error - CarMe',
                message: 'Driver not found.',
                backUrl: '/',
                buttonText: 'Go back to main page'
            });
        }

        driver._id = driver._id ? driver._id.toString() : driver.id;

        res.render('detail', {
            pageTittle: `${driver.name} - CarMe`,
            driver: driver,
            driverId: driver._id
        });
    } catch (error) {
        console.error('Error loading driver details:', error);
        res.status(500).render('confirmation', {
            pageTittle: 'Error - CarMe',
            message: 'An error occurred while loading the driver details. Please try again later.',
            backUrl: '/',
            buttonText: 'Go back to main page'
        });
    }
});






router.post('/newtrip', upload.single('tripImage'), async (req, res) => {
    const driverId = req.body.driverId;
    const detailUrl = `/detail/${driverId}`;

    try {
        const driver = await board.getDriver(driverId);

        if (!driver) {
            if (req.file) {
                await fs.unlink(req.file.path);
            }
            return res.status(404).render('confirmation', {
                pageTittle: 'Error - CarMe',
                message: 'Driver not found.',
                backUrl: '/',
                buttonText: 'Go back to main page'
            });
        }

        const validationError = validateTrip(req.body, driver, req.file);

        if (validationError) {
            if (req.file) {
                await fs.unlink(req.file.path);
            }
            return res.status(400).render('confirmation', {
                pageTittle: 'Error - CarMe',
                message: validationError,
                backUrl: detailUrl,
                buttonText: 'Go back to driver'
            });
        }

        const trip = {
            image: req.file.filename,
            title: req.body.tripTitle.trim(),
            origin: req.body.tripOrigin.trim(),
            destination: req.body.tripDestination.trim(),
            dateHour: formatDateHour(req.body.tripDateTime),
            price: parseFloat(req.body.tripPrice),
            intercommunity: req.body.isIntercommunity === 'on'
        };

        await board.addTrip(driverId, trip);

        res.render('confirmation', {
            pageTittle: 'Viaje creado - CarMe',
            message: 'El viaje ha sido añadido con éxito.',
            nextUrl: detailUrl,
            buttonText: 'Ver detalle del conductor'
        });

    } catch (error) {
        console.error('Error processing trip data:', error);
        if (req.file) {
            await fs.unlink(req.file.path);
        }
        res.status(500).render('confirmation', {
            pageTittle: 'Error del servidor - CarMe',
            message: 'Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.',
            backUrl: '/',
            buttonText: 'Volver a la página principal'
        });
    }
});












router.get('/deletetrip/:tripId/:driverId', async (req, res) => {
    try {
        await board.deleteTrip(req.params.driverId, req.params.tripId);
        
        res.render('confirmation', {
            pageTittle: 'Viaje eliminado - CarMe',
            message: 'El viaje ha sido eliminado con éxito.',
            nextUrl: `/detail/${req.params.driverId}`,
            buttonText: 'Volver al perfil del conductor'
        });
        
    } catch (error) {
        console.error("Error al borrar el viaje:", error);
        
        res.status(500).render('confirmation', {
            pageTittle: 'Error - CarMe',
            message: 'No se pudo eliminar el viaje.',
            backUrl: `/detail/${req.params.driverId}`,
            buttonText: 'Volver al perfil'
        });
    }
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
            return res.status(400).render('confirmation', {
                pageTittle: 'Error - CarMe',
                message: validationError,
                backUrl: backUrl,
                buttonText: 'Go back to form'
            });
        }

        let finalImage = '/images/default_driver.png';
        if (req.file) {
            finalImage = req.file.filename;
        } else if (isEdit && req.body.oldImage) {
            finalImage = req.body.oldImage;
        }

        const driverData = {
            name: req.body.DriverName.trim(),
            community: req.body.AutonomousComunity,
            vehicle: req.body.Cartype,
            puntuation: parseFloat(req.body.puntuation),
            experience: parseInt(req.body.experience),
            availableSpots: parseInt(req.body.AvailableSpots),
            availability: req.body.Availability === 'on',
            image: finalImage
        };

        if (isEdit) {
            driverData.id = currentID;
            await board.updateDriver(driverData);
            return res.render('confirmation', {
                pageTittle: 'Conductor actualizado - CarMe',
                message: 'El conductor ha sido actualizado con éxito.',
                nextUrl: `/detail/${currentID}`,
                buttonText: 'Ver detalle del conductor'
            });
        } else {
            const createdId = await board.addDriver(driverData);
            const newId = driverData._id || (result && result.insertedId) || (result && result.ops && result.ops[0]._id);
            const targetId = newId ? newId.toString() : '';
            return res.render('confirmation', {
                pageTittle: 'Conductor creado - CarMe',
                message: 'El conductor ha sido creado con éxito.',
                nextUrl: `/detail/${targetId}`,
                buttonText: 'Ver detalle del conductor'
            });
        }

    } catch (error) {
        console.error('Error processing driver data:', error);
        if (req.file) {
            await fs.unlink(req.file.path);
        }
        res.status(500).render('confirmation', {
            pageTittle: 'Error del servidor - CarMe',
            message: 'Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.',
            backUrl: isEdit ? `/editdriver/${currentID}` : '/newdriver',
            buttonText: 'Volver al formulario'
        });
    }
});     






router.get('/post/:id/image', async (req, res) => {

    let driver = await board.getDriver(req.params.id);

    res.download(board.UPLOADS_FOLDER + '/' + driver.image);

});










router.get('/trip/:driverId/:tripId/image', async (req, res) => {
    try {
        const driver = await board.getDriver(req.params.driverId);
        const trip = driver?.trips?.find(t => t._id === req.params.tripId);

        if (!trip || !trip.image) {
            return res.status(404).send('Image not found');
        }

        const imagePath = trip.image.startsWith('/images/')
            ? path.resolve('./public', trip.image.slice(1))
            : path.resolve(board.UPLOADS_FOLDER, trip.image);
        
        res.sendFile(imagePath);
    } catch (error) {
        console.error('Error retrieving trip image:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/delete/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await board.deleteDriver(id);
        
        // Si todo va bien (Éxito)
        res.render('confirmation', {
            pageTittle: 'Conductor eliminado - CarMe',
            message: 'El perfil del conductor ha sido eliminado correctamente.',
            nextUrl: '/',
            buttonText: 'Volver a la página principal'
        });

    } catch (error) {
        console.error('Error al eliminar el conductor:', error);
        
        res.status(500).render('confirmation', {
            pageTittle: 'Error - CarMe',
            message: 'Ha ocurrido un problema y no se ha podido eliminar al conductor.',
            backUrl: `/detail/${id}`,
            buttonText: 'Volver al perfil del conductor'
        });
    }
});






router.get('/post/video', (req, res) => {
    res.download(board.UPLOADS_FOLDER + '/video.mp4');
});

router.get('/trip/:id/image', async (req, res) => {
    const trip = await board.getTrip(req.params.id);
    res.download(board.UPLOADS_FOLDER + '/' + trip.image);
});