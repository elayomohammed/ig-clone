import {Dexie} from 'dexie';

//database initialization
const db = new Dexie('instagram-clone-db');
db.version(0.1).stores({
    about: ', name, bio',
    profilePhoto: ', name',
    gallery: '++id, name'
});

export default db;