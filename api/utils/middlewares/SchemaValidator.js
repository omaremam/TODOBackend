const _ = require('lodash');
const Joi = require('@hapi/joi');
const Schemas = require('../../joi/Schemas');

module.exports = (useJoiError = false) => {

    const _useJoiError = _.isBoolean(useJoiError) && useJoiError;

    const _supportedMethods = ['post', 'put'];

    const _validationOptions = {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true
    };


    return (req, res, next) => {
        const route = req.route.path;
        const method = req.method.toLowerCase();

        if (_.includes(_supportedMethods, method) && _.has(Schemas, route)) {


            const _schema = _.get(Schemas, route);

            if (_schema) {


                return Joi.validate(req.body, _schema, _validationOptions, (err, data) => {
                    if (err) {



                        const JoiError = {
                            errors: err.details.map(errorObject => errorObject.message.replace(/['"]/g, ''))
                        };


                        const CustomError = {
                            status: 'failed',
                            error: 'Invalid request data. Please review request and try again.'
                        };


                        res.status(422).json(_useJoiError ? JoiError : CustomError);

                    } else {

                        req.body = data;
                        next();
                    }

                });

            }
        }

        next();
    };
};