module.exports = function errorHandler(err, req, res, next){
    console.log(err);
    res.status(500).json({
        error : err
    });
}