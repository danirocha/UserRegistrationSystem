import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';

class Database {
    constructor () {
        this.db = new JsonDB(new Config("myDataBase"));

        this.db.count = (rootElem) => {
            const array = this.db.getData(`/${rootElem}`);

            return array.length;
        }
    }

    select(rootElem, property, value) {
        let index;

        try {    
            index = this.db.getIndex(`/${rootElem}`, value, property);
        } catch (err) {
            return;
        }
        
        return (index >= 0) ? { ...this.db.getData(`/${rootElem}[${index}]`) } : null;
    }

    selectAll(rootElem) {
        const items = this.db.getData(`/${rootElem}`);

        if (!items) return;

        return items.map(item => ({ ...item }));
    }

    insert(rootElem, insertObj) {
        try {
            let elemsCount = this.db.count(rootElem);
            insertObj.id = ++elemsCount;
        } catch (err) {
            insertObj.id = 1;
        }

        this.db.push(`/${rootElem}[]`, insertObj, true);

        return { ...this.db.getData(`/${rootElem}[-1]`) };
    }

    update(rootElem, elemId, updateObj) {
        const index = this.db.getIndex(`/${rootElem}`, elemId, "id");
        const currentObj = this.db.getData(`/${rootElem}[${index}]`);

        this.db.push(`/${rootElem}[${index}]`, { ...currentObj, ...utils.sanitizeObj(updateObj) }, true);

        return { ...this.db.getData(`/${rootElem}[${index}]`) };
    }

    delete(rootElem, elemId) {
        const index = this.db.getIndex(`/${rootElem}`, elemId, "id");
        const deletedElem = { ...this.db.getData(`/${rootElem}[${index}]`) };
        
        this.db.delete(`/${rootElem}[${index}]`);

        return deletedElem;
    }
}

export default new Database();