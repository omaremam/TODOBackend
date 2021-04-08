module.exports = (res, err, source) => {
    console.log(err)
    if(err.name==="ValidationError"){
        return res.status(409).send({
            errors:[err.message || "Something went wrong in " + source]
        });
    }
    else if (err.kind === 'ObjectId') {
        return res.status(404).send({
            errors: ["Object id not fond in " + source]
        });
    }
    else res.status(500).send({
        errors: [err.message || "Something went wrong in " + source]
    });
}