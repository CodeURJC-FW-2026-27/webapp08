import express from 'express';
import * as board from './board.js';

const router = express.Router();
export default router;


//GENERAL ROUTER OF MAIN PAGE
router.get('/', (req, res) => {

    const drivers = board.getDrivers();
    

    //catch the type, for the filter
    const tipo = req.query.tipo;
    
    
    //manage the filter to show only the required
    let filtro = drivers;

    if (tipo){
        filtro = drivers.filter(drivers => drivers.vehiculo === tipo) 
    }
      
    res.render('main', {
        filtro
        
    });

});



//GENERAL ROUTER OF NEWDRIVER PAGE
router.get('/newdriver', (req, res) => {
    let title;
    const editAdd = req.query.editAdd;
    if (editAdd === "edit"){
        title = "Editar conductor"

    }
    else if (editAdd === "add"){
        title = "Nuevo conductor"

    }
    
    res.render('newdriver', {
        title
        
    });

});



//GENERAL ROUTER OF DETAIL PAGE
router.get('/detail/:id', (req, res) => {
   const id = req.params.id;
   const driver = board.getDriver(id);
   
    
    res.render('detail', {
        driver
    });

});









//tengo que ver cosas
router.get('/delete/:id', (req, res) => {
    const id = req.params.id;
    board.deleteDriver(id);
    res.redirect('/');
});
