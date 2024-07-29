function is_authenticated(req, res, next){
    if (req.session.userId){
        return next;
    } else {
        res.status(400).json({message: 'Login to add recipes'});
    }
}

module.exports = is_authenticated;