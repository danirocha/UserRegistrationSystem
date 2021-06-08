class Utils {
    constructor() {
        // -
    }

    sanitizeObj(obj) {
        const resultObj = {};

        for (let key in obj) {
            if (obj[key]) {
                resultObj[key] = obj[key];
            }
        }

        return resultObj;
    }
}

export default new Utils();