function is_authenticated(req, res, next){
    if (req.session.userId){
        return next();
    } else {
        res.status(401).json({message: 'Unauthorized'});
    }
}

module.exports = is_authenticated;