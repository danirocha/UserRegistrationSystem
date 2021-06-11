import Schema from '../../libs/Schema';

const login = async (req, res, next) => {
    const loginDTO = req.body;
    const loginSchema = Schema.generateLoginSchema();
    
    try {
        await Schema.validate(loginSchema, loginDTO);

        next();
    } catch (err) {
        return res.sendResponse({ status: 400, data: { message: 'invalid login data', errors: err.errors }});
    }
};

const storeUser = async (req, res, next) => {
    const userDTO = req.body;
    const newUserSchema = Schema.generateUserSchema();
    
    try {
        await Schema.validate(newUserSchema, userDTO);

        next();
    } catch (err) {
        return res.sendResponse({ status: 400, data: { message: 'invalid registration data', errors: err.errors }});
    }
};

const updateUser = async (req, res, next) => {
    const userDTO = req.body;
    const updatedUserSchema = Schema.generateUserSchema({ required: false });
    
    try {
        await Schema.validate(updatedUserSchema, userDTO);

        next();
    } catch (err) {
        return res.sendResponse({ status: 400, data: { message: 'invalid update data', errors: err.errors }});
    }
};

export { login, storeUser, updateUser };