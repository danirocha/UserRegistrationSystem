import * as yup from 'yup';

const login = async (req, res, next) => {
    const loginDTO = req.body;
    const loginSchema = yup.object().shape({
        email: yup.string().email().required(),
        password: yup.string().required()
    });
    
    try {
        await loginSchema.validate(loginDTO, { abortEarly: false });

        next();
    } catch (err) {
        return res.sendResponse({ status: 400, data: { message: 'invalid login data', errors: err.errors }});
    }
};

const storeUser = async (req, res, next) => {
    const userDTO = req.body;
    const newUserSchema = yup.object().shape({
        name: yup.string().required(),
        email: yup.string().email().required(),
        cpf: yup.string().length(11).matches(/\d/).required(),
        password: yup.string().min(6).required()
    });
    
    try {
        await newUserSchema.validate(userDTO, { abortEarly: false });

        next();
    } catch (err) {
        return res.sendResponse({ status: 400, data: { message: 'invalid registration data', errors: err.errors }});
    }
};

const updateUser = async (req, res, next) => {
    const userDTO = req.body;
    const updatedUserSchema = yup.object().shape({
        name: yup.string(),
        email: yup.string().email(),
        cpf: yup.string().length(11).matches(/\d/),
        password: yup.string().min(6)
    });
    
    try {
        await updatedUserSchema.validate(userDTO, { abortEarly: false });

        next();
    } catch (err) {
        return res.sendResponse({ status: 400, data: { message: 'invalid update data', errors: err.errors }});
    }
};

export { login, storeUser, updateUser };