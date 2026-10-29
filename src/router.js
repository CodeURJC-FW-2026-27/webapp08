import express from 'express';

const router = express.Router();
export default router;


router.get('/', (req, res) => {
    
    res.render('main', {
        
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



