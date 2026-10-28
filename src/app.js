import express from 'express';
import multer from 'multer';
import driverRoutes from './router.js'; 
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Initialize express app
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

app.use('/public', express.static(path.join(__dirname, '../public')));

app.use('/api/drivers', driverRoutes);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000/api/drivers/main');
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });



function validateDriverData(body, file) {
    // Full validation logic 
    const errors = [];

    if (!body.DriverName || body.DriverName.trim() === '') {
        errors.push('Name is required');
    } else {
        const name = body.DriverName.trim();
        if (name.length < 1 || name.length > 30) {
            errors.push('Name must be between 1 and 30 characters');
        }
        if (!/^([A-Za-zÁÉÍÓÚÑáéíóúñ\s])+$/.test(name)) {
            errors.push('Name must contain only letters and spaces');
        }
    }

    const validCommunities = ['andalucia', 'cataluna', 'madrid', 'valencia', 'galicia', 'murcia', 'vasco', 'navarra', 'extremadura', 'canarias', 'baleares', 'ceuta', 'melilla', 'asturias', 'cantabria']; 
    if (!validCommunities.includes(body.AutonomousComunity)) {
        errors.push('AutonomousComunity must be a valid community');
    }

    const validVehicleTypes = ['normal', 'xl', 'eco', 'luxury'];
    if (!validVehicleTypes.includes(body.Cartype)) {
        errors.push('Cartype must be a valid vehicle type');
    }

    if (!body.puntuation || isNaN(body.puntuation) || body.puntuation < 0 || body.puntuation > 5) {
        errors.push('Puntuation must be a number between 0 and 5');
    }

    if (!body.experience || isNaN(body.experience) || body.experience < 0) {
        errors.push('Experience must be a non-negative number');
    }

    if (!body.AvailableSpots || isNaN(body.AvailableSpots) || body.AvailableSpots < 1 || body.AvailableSpots > 4) {
        errors.push('AvailableSpots must be a number between 1 and 4');
    }

    if (!file) {
        errors.push('Image file is required');
    } else if (!file.mimetype.startsWith('image/')) {
        errors.push('Uploaded file must be an image');
    }

    
    return errors;
}
app.post('/newdriver', upload.single('image'), (req, res) => {
    console.log("Received new driver data:", req.body);
    console.log("Received file:", req.file);

    const validationErrors = validateDriverData(req.body, req.file);

    if (validationErrors.length > 0) {
        return res.status(400).send(`Errors:\n- ${validationErrors.join('\n- ')}`);
    }

    const newDriver = {
        name: req.body.DriverName.trim(),
        community: req.body.AutonomousComunity,
        carType: req.body.Cartype,
        puntuation: parseFloat(req.body.puntuation),
        experience: parseInt(req.body.experience, 10),
        spots: parseInt(req.body.AvailableSpots, 10),
        isAvailable: req.body.isAvailable === 'on',
        imagePath: req.file.path
    };

    console.log("New driver created:", newDriver);

    res.status(200).send('Driver created successfully');
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

