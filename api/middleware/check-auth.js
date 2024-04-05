const jwt = require('jsonwebtoken');
require('dotenv').config()

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        /*as per convention the token sent in authorization part of the header which holds any data
        needed to authorize a request in this case a token, typically a token is sent by adding
        Bearer along with the token character string as the value for the authorization header content-type
        passing the token in this means that parsing the request body does provide the token */
        /*the split function is used to separate Bearer and the space that follows it from actual token string 
        value where "Bearer " is in array element 0 and the token is in element 1*/ 
        const decoded = jwt.verify(token, process.env.JWT_KEY); 
        //the verify function returns decoded token(payload and secretkey etc) if it succeeds
        req.userData = decoded; //the decoded token is added to the request object as the property userData
        next(); 
        /*next is called after successful authentication so that next middleware can be executed
        see post route in product.js*/
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
    /*try catch is used because the verify function will throw an error if verification fails */
};
