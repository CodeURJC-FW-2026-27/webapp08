import express from 'express';
import multer from 'multer';
import * as board from './board.js';
import fs from 'node:fs/promises';
import path from 'node:path';

const router = express.Router();
export default router;

const upload = multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => cb(null, file.mimetype.startsWith('image/'))
});

const COMMUNITIES = ['Andalucia', 'Cataluña', 'Madrid', 'Valencia', 'Galicia', 'Murcia', 'Vasco',
    'Navarra', 'Extremadura', 'Canarias', 'Baleares', 'Ceuta', 'Melilla', 'Asturias', 'Cantabria'];
const VEHICLES = ['Normal', 'XL', 'Eco', 'Luxury'];

async function validateDriver(body, isEdit, currentID, file) {
    const name = body.DriverName ? body.DriverName.trim() : '';
    const community = body.AutonomousComunity;
    const cartype = body.Cartype;
    const punctuation = parseFloat(body.puntuation);
    const experience = parseInt(body.experience);
    const availableSpots = parseInt(body.AvailableSpots);

    if (!name || !community || !cartype || isNaN(punctuation) || isNaN(experience) || isNaN(availableSpots)) {
        return "Todas los campos son obligatorios y deben ser válidos.";
    }
    if (!COMMUNITIES.includes(community)) {
        return "La comunidad autónoma no es válida.";
    }
    if (!VEHICLES.includes(cartype)) {
        return "El tipo de vehículo no es válido.";
    }
    if (!isEdit && !file) {
        return "Se requiere una imagen válida para el conductor.";
    }
    if (name.length < 3 || name.length > 50) {
        return "El nombre debe tener entre 3 y 50 caracteres.";
    }
    if (!/^[A-ZÁÉÍÓÚÑ]/.test(name)) {
        return "El nombre debe comenzar con una letra mayúscula.";
    }
    if (isNaN(punctuation) || punctuation < 0 || punctuation > 5) {
        return "La puntuación debe ser un número entre 0 y 5.";
    }
    if (isNaN(experience) || experience < 0) {
        return "La experiencia debe ser un número no negativo.";
    }
    if (isNaN(availableSpots) || availableSpots < 1 || availableSpots > 8) {
        return "Los asientos disponibles deben ser un número entre 1 y 8.";
    }

    // Check for duplicate names
    const duplicate = await board.getDriverByName(name);

    if (duplicate) {
        const duplicateId = duplicate._id ? duplicate._id.toString() : duplicate.id;
        if (!isEdit || duplicateId !== currentID) {
            return "Un conductor con este nombre ya existe.";
        }
    }
    return null; // No validation errors
}

function renderConfirmation(res, { title, message, nextUrl, buttonText }) {
    return res.render('confirmation', {
        pageTittle: `${title} - CarMe`,
        message,
        nextUrl,
        buttonText
    });
}

function renderError(res, status, message, backUrl = '/', buttonText = 'Volver a la página principal', title = 'Error') {
    return res.status(status).render('confirmation', {
        pageTittle: `${title} - CarMe`,
        message,
        backUrl,
        buttonText
    });
}

// Validates a text field of a trip (title, origin, destination)
function validateTripText(value, label) {
    if (value.length < 3 || value.length > 100) {
        return `El ${label} debe tener entre 3 y 100 caracteres.`;
    }
    if (!/^[A-ZÁÉÍÓÚÑ]/.test(value)) {
        return `El ${label} debe comenzar con una letra mayúscula.`;
    }
    return null;
}

// Converts "2026-11-20T09:00" (datetime-local) to "20/11/2026 09:00" (format used in the data)
function formatDateHour(value) {
    const [date, time] = value.split('T');
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year} ${time}`;
}

// Converts "20/11/2026 09:00" to "2026-11-20T09:00"
function toDateTimeLocal(dateHour) {
    if (!dateHour || !dateHour.includes(' ')) return '';
    const [date, time] = dateHour.split(' ');
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}T${time}`;
}

function validateTrip(body, driver, file, isEdit = false, currentTripId = null) {
    const title = body.tripTitle ? body.tripTitle.trim() : '';
    const origin = body.tripOrigin ? body.tripOrigin.trim() : '';
    const destination = body.tripDestination ? body.tripDestination.trim() : '';
    const dateTime = body.tripDateTime;
    const price = parseFloat(body.tripPrice);

    if (!title || !origin || !destination || !dateTime || isNaN(price)) {
        return "Todos los campos son obligatorios y deben ser válidos.";
    }

    const textError = validateTripText(title, 'título')
        || validateTripText(origin, 'origen')
        || validateTripText(destination, 'destino');
    if (textError) {
        return textError;
    }
    if (origin.toLowerCase() === destination.toLowerCase()) {
        return "El origen y el destino deben ser diferentes.";
    }

    const date = new Date(dateTime);
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dateTime) || isNaN(date.getTime())) {
        return "La fecha y hora no son válidas.";
    }
    if (date <= new Date()) {
        return "La fecha y hora deben estar en el futuro.";
    }

    if (price < 0 || price > 500) {
        return "El precio debe ser un número entre 0 y 500.";
    }
    if (!isEdit && !file) {
        return "Se requiere una imagen de portada.";
    }

    // Check for duplicate trips of the same driver
    const formattedDate = formatDateHour(dateTime);
    const duplicate = (driver.trips || []).some(trip => {
        const tripIdStr = trip._id ? trip._id.toString() : '';
        if (isEdit && tripIdStr === currentTripId) return false; // Skip the current trip when editing  
        return trip.origin.toLowerCase() === origin.toLowerCase() &&
            trip.destination.toLowerCase() === destination.toLowerCase() &&
            trip.dateHour === formattedDate;
    });
    if (duplicate) {
        return "Este conductor ya tiene un viaje con el mismo origen, destino y fecha.";
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
        filter: drivers,
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
            return renderError(res, 404, 'Conductor no encontrado.');
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
        return renderError(res, 500, 'Ocurrió un error mientras se cargaban los datos del conductor. Por favor, inténtelo de nuevo más tarde.');
    }
});








router.get('/detail/:id', async (req, res) => {
    const driverId = req.params.id;

    if (!driverId) {
        return renderError(res, 400, 'Se requiere el ID del conductor.');
    }

    try {
        const driver = await board.getDriver(driverId);

        if (!driver) {
            return renderError(res, 404, 'Conductor no encontrado.');
        }

        driver._id = driver._id ? driver._id.toString() : driver.id;

        res.render('detail', {
            pageTittle: `${driver.name} - CarMe`,
            driver: driver,
            driverId: driver._id
        });
    } catch (error) {
        console.error('Error loading driver details:', error);
        return renderError(res, 500, 'Ocurrió un error mientras se cargaban los detalles del conductor. Por favor, inténtelo de nuevo más tarde.');
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
            return renderError(res, 404, 'Conductor no encontrado.');
        }

        const validationError = validateTrip(req.body, driver, req.file);

        if (validationError) {
            if (req.file) {
                await fs.unlink(req.file.path);
            }
            return renderError(res, 400, validationError, detailUrl, 'Volver al perfil del conductor');
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

        return renderConfirmation(res, {
            title: 'Viaje creado',
            message: 'El viaje ha sido añadido con éxito.',
            nextUrl: detailUrl,
            buttonText: 'Ver detalle del conductor'
        });

    } catch (error) {
        console.error('Error processing trip data:', error);
        if (req.file) {
            await fs.unlink(req.file.path);
        }
        return renderError(res, 500, 'Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.', '/', 'Volver a la página principal', 'Error del servidor');
    }
});












router.get('/deletetrip/:tripId/:driverId', async (req, res) => {
    const { tripId, driverId } = req.params;

    try {
        await board.deleteTrip(driverId, tripId);
        
        return renderConfirmation(res, {
            title: 'Viaje eliminado',
            message: 'El viaje ha sido eliminado con éxito.',
            nextUrl: `/detail/${driverId}`,
            buttonText: 'Volver al perfil del conductor'
        });
        
    } catch (error) {
        console.error("Error al borrar el viaje:", error);
        return renderError(res, 500, 'No se pudo eliminar el viaje.', `/detail/${driverId}`, 'Volver al perfil');
    }
});

router.get('/edittrip/:tripId/:driverId', async (req, res) => {
    const { tripId, driverId } = req.params;

    try {
        const driver = await board.getDriver(driverId);
        const trip = driver?.trips?.find(t => t._id.toString() === tripId);

        if (!driver || !trip) {
            return renderError(res, 404, 'Conductor o viaje no encontrado.', driver ? `/detail/${driverId}` : '/', 'Volver');
        }

        trip._id = trip._id.toString();
        trip.dateTimeInput = toDateTimeLocal(trip.dateHour);

        res.render('editTrip', {
            pageTittle: 'Editar viaje - CarMe',
            trip: trip,
            driverId: driverId
        });
    } catch (error) {
        console.error('Error al cargar el viaje para editar:', error);
        return renderError(res, 500, 'Ocurrió un error al cargar el viaje. Por favor, inténtelo de nuevo más tarde.', `/detail/${driverId}`, 'Volver al perfil del conductor', 'Error del servidor');
    }
});

router.post('/edittrip', upload.single('tripImage'), async (req, res) => {
    const { driverId, tripId, oldImage } = req.body;
    const detailUrl = `/detail/${driverId}`;
    const editUrl = `/edittrip/${tripId}/${driverId}`;

    try {
        const driver = await board.getDriver(driverId);

        if (!driver) {
            if (req.file) await fs.unlink(req.file.path);
            return renderError(res, 404, 'Conductor no encontrado.');
        }

        const validationError = validateTrip(req.body, driver, req.file, true, tripId);

        if (validationError) {
            if (req.file) await fs.unlink(req.file.path);
            return renderError(res, 400, validationError, editUrl, 'Volver al formulario de edición');
        }

        const updatedTrip = {
            title: req.body.tripTitle.trim(),
            origin: req.body.tripOrigin.trim(),
            destination: req.body.tripDestination.trim(),
            dateHour: formatDateHour(req.body.tripDateTime),
            price: parseFloat(req.body.tripPrice),
            intercommunity: req.body.isIntercommunity === 'on',
            image: req.file ? req.file.filename : oldImage
        };

        await board.updateTrip(driverId, tripId, updatedTrip);

        return renderConfirmation(res, {
            title: 'Viaje actualizado',
            message: 'El viaje ha sido actualizado con éxito.',
            nextUrl: detailUrl,
            buttonText: 'Ver detalle del conductor'
        });
    } catch (error) {
        console.error('Error al actualizar el viaje:', error);
        if (req.file) await fs.unlink(req.file.path);
        return renderError(res, 500, 'Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.', editUrl, 'Volver al formulario de edición', 'Error del servidor');
    }
});





router.post('/newdriver', upload.single('image'), async (req, res) => {
    const isEdit = Boolean(req.body.driverId);
    const currentID = req.body.driverId ? req.body.driverId.trim() : '';
    const formUrl = isEdit ? `/editdriver/${currentID}` : '/newdriver';

    try {
        const validationError = await validateDriver(req.body, isEdit, currentID, req.file);

        if (validationError) {
            if (req.file) {
                await fs.unlink(req.file.path);
            }

            return renderError(res, 400, validationError, formUrl, 'Volver al formulario');
        }

        let finalImage = req.body.oldImage;
        if (req.file) {
            finalImage = req.file.filename;
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
            return renderConfirmation(res, {
                title: 'Conductor actualizado',
                message: 'El conductor ha sido actualizado con éxito.',
                nextUrl: `/detail/${currentID}`,
                buttonText: 'Ver detalle del conductor'
            });
        } else {
            const createdId = await board.addDriver(driverData);
            const newId = driverData._id || (result && result.insertedId);
            const targetId = newId ? newId.toString() : '';
            return renderConfirmation(res, {
                title: 'Conductor creado',
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
        return renderError(res, 500, 'Ocurrió un error al procesar la solicitud. Por favor, inténtelo de nuevo más tarde.', formUrl, 'Volver al formulario', 'Error del servidor');
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
        return renderConfirmation(res, {
            title: 'Conductor eliminado',
            message: 'El perfil del conductor ha sido eliminado correctamente.',
            nextUrl: '/',
            buttonText: 'Volver a la página principal'
        });
    } catch (error) {
        console.error('Error al eliminar el conductor:', error);
        return renderError(res, 500, 'Ha ocurrido un problema y no se ha podido eliminar al conductor.', `/detail/${id}`, 'Volver al perfil del conductor');
    }
});






router.get('/post/video', (req, res) => {
    res.download(board.UPLOADS_FOLDER + '/video.mp4');
});

router.get('/trip/:id/image', async (req, res) => {
    const trip = await board.getTrip(req.params.id);
    res.download(board.UPLOADS_FOLDER + '/' + trip.image);
});