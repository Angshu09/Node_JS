const {validateToken} = require("../services/auth")

function checkForAuthenticationCookie(cookieName){
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName]
        if(!tokenCookieValue) return next()
            

        try {
            const payload = validateToken(tokenCookieValue)
            // console.log( "payload", payload)
            req.user = payload
        } catch (error) {
            
        }
        return next()
    }
}

module.exports = {
    checkForAuthenticationCookie
}