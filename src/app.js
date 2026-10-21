import express from 'express';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

console.log("Multer is ready to intercept files.");