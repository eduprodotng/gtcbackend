module.exports = function(req, res, next){
    const role = req.user.role_id

    if(!role) {
        return res.status(401).json({ status: 'error', message: 'user unauthorized', data: null });
    } else {
        if(role == 1){
            next()
        } else{
            return res.status(401).json({ status: 'error', message: 'user unauthorized', data: null });
        }  
    }
}