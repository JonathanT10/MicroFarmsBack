function admin(req, res, next) {

    if (!req.isAdmin) return res.status(403).send(`Access denied.`);

    return next();
}

module.exports = admin;