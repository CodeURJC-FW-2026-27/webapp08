const driversMap = new Map();
let nextId = 0;


export function addDriver(driver) {
    let id = nextId++;
    driver.id = id.toString();
    driversMap.set(driver.id, driver);
}

export function deleteDriver(id){
    driversMap.delete(id);
}

export function getDrivers(){
    return [...driversMap.values()];
}

export function getDriver(id){
    return driversMap.get(id);
}