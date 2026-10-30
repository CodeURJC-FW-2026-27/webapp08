import express from 'express';

const router = express.Router();
export default router;


const drivers = [
    {id: 12345,
    nombre: "Ana López",
    comunidad: "Madrid",
    vehiculo: "XL",
    puntuacion: 4.5,
    experiencia: 3,
    disponibilidad: true,
    plazasDisponibles: 3,
    imagen: "/images/ana_lopez.jpg"},



    {id: 12346,
    nombre: "Antonio Sanchez",
    comunidad: "Madrid",
    vehiculo: "Eco",
    puntuacion: 3,
    experiencia: 3,
    disponibilidad: true,
    plazasDisponibles: 4,
    imagen: "/images/Antonio_sanchez.jpg"},
    

    {id: 12348,
    nombre: "Carlos Vicente",
    comunidad: "Madrid",
    vehiculo: "Normal",
    puntuacion: 3.5,
    experiencia: 3,
    disponibilidad: true,
    plazasDisponibles: 3,
    imagen: "/images/carlos_vicente.jpg"},




    {id: 12356,
    nombre: "Alejandro Aparisi",
    comunidad: "Madrid",
    vehiculo: "Luxury",
    puntuacion: 4.5,
    experiencia: 3,
    disponibilidad: true,
    plazasDisponibles: 2,
    imagen: "/images/Alejandro_aparisi.avif"},

    {id: 15347,
    nombre: "Faustino Blazquez",
    comunidad: "Madrid",
    vehiculo: "XL",
    puntuacion: 4,
    experiencia: 3,
    disponibilidad: false,
    plazasDisponibles: 3,
    imagen: "/images/Faustino_blazquez.jpg"},

    {id: 43246,
    nombre: "Fernando Redondo",
    comunidad: "Madrid",
    vehiculo: "XL",
    puntuacion: 3.5,
    experiencia: 3,
    disponibilidad: true,
    plazasDisponibles: 5,
    imagen: "/images/Fernando_redondo.jpg"},
    

    {id: 74693,
    nombre: "Makelelé Villalon",
    comunidad: "Madrid",
    vehiculo: "Eco",
    puntuacion: 1.5,
    experiencia: 3,
    disponibilidad: true,
    plazasDisponibles: 3,
    imagen: "/images/Makelele_villalon.png"},
    

    {id: 43685,
    nombre: "Apu Cherkvasky",
    comunidad: "Madrid",
    vehiculo: "Luxury",
    puntuacion: 5,
    experiencia: 3,
    disponibilidad: false,
    plazasDisponibles: 4,
    imagen: "/images/Apu_Cherkvasky.jpg"},
    

    {id: 42167,
    nombre: "Pepe Barbacid",
    comunidad: "Madrid",
    vehiculo: "Normal",
    puntuacion: 4.5,
    experiencia: 3,
    disponibilidad: true,
    plazasDisponibles: 2,
    imagen: "/images/Pepe_barbacid.jpg"}

];



router.get('/', (req, res) => {

    const tipo = req.query.tipo;
    let filtro = drivers;

    if (tipo){
        filtro = drivers.filter(drivers => drivers.vehiculo === tipo)
    }
        
    res.render('main', {
        filtro
        
    });

});




router.get('/newdriver', (req, res) => {
    
    res.render('newdriver', {
        
    });

});

router.get('/detail', (req, res) => {
    
    res.render('detail', {
        
    });

});



