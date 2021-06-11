import * as yup from 'yup';

class Schema {
    constructor() {
        this.email = yup.string().email();
        this.cpf = yup.string().length(11).matches(/\d/);
        this.password = yup.string().min(6);
    }

    _generateField(label, required) {
        let field = this[label] || yup.string();

        if(required) field = field.required();

        return field;
    }

    generateLoginSchema() {
        const loginSchema = {
            email: this._generateField('email', true),
            password: this._generateField('password', true)
        };

        return yup.object().shape(loginSchema);
    }

    generateUserSchema({ required = true } = {}) {
        const userSchema = {
            name: this._generateField('name', required),
            email: this._generateField('email', required),
            cpf: this._generateField('cpf', required),
            password: this._generateField('password', required)
        };

        return yup.object().shape(userSchema);
    }

    async validate(schema, DTO) {
        return await schema.validate(DTO, { abortEarly: false });
    }
}

export default new Schema();