import fs from 'node:fs/promises';
import * as board from './board.js';

const DATA_FOLDER = './data';

let dataFile = 'data.json';

const dataString = await fs.readFile(DATA_FOLDER + '/' + dataFile, 'utf8');

const drivers = JSON.parse(dataString);

for(let driver of drivers){
    board.addDriver(driver);
}


console.log('Demo data loaded');