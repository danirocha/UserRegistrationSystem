import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';

class Database {
    constructor () {
        this.db = new JsonDB(new Config("myDataBase"));
    }

    select(rootElem, property, value) {
        let elemID;

        try {    
            elemID = this.db.getIndex(`/${rootElem}`, value, property);
        } catch (err) {
            return false;
        }
        
        return (elemID >= 0) ? this.db.getData(`/${rootElem}[${elemID}]`) : false;
    }

    insert(rootElem, insertObj) {
        this.db.push(`/${rootElem}[]`, insertObj, true);
    }

    update() {
        // -
    }

    delete() {
        // -
    }
}

export default new Database();