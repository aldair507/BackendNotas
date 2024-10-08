import App from './app.js';
import { database } from './db.js';
database();

App.listen(4000,()=>{
    console.log('server is running on port',4000);
})