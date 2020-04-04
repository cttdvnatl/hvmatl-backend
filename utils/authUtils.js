const jwt = require('jsonwebtoken');
// const TOKEN_ENCODE_KEY = `-----BEGIN RSA PRIVATE KEY-----
// MIICXAIBAAKBgQCVY8z2o8BgxVtVMb5mGQ5cSpvezXuZfZtwianNvHOgwK8zfDsO
// xkzxoW96liFK44JTahjHX1Beq1Ny1Hmirepg1/LdsIFEMwp0nFDfRxrJZJDwWjTZ
// AIOHh143PVqE4W4bA5tQm/VqY/bRY0UasCyrXzeLtLxEFgq+bE22OnbPCwIDAQAB
// AoGBAJIxFjUOzoZk3BolEdRMFNeQU7TXlWsBlomszjT9hJH9vfY+TnUI7edQOg3W
// uUHWHoWOwCzrQ3VBZ+ppr5bZZxBRvGxaZGURIhcKmzOtFCFAsDprqL5kxX7NKT3x
// wRhBaMrtMnjVpmD/LKQtTTMy6mINki7sK5nkg2nNQdC7ZRLRAkEA9bxWV8KPXHeJ
// JMF+r6wYLxuhzfNZnf11rH9IDYWIxQVSGEv6tnnJNa8kTB3AYgSxpOLPEUTU/51e
// 68tj8wUi7wJBAJuhO6FDGnWUkla/b4DRB2zO9Gasg2kN8mwSFjicBBuz3cWE+aAI
// D52HTCplW1/ljPrPoSy0gX0WSkWR67iRZaUCQFYOcdJkEV6Zgg68MIiG5SVCMQT1
// 7vF0PMx++pW5qO8OcPSPTyquNbe2MSjy1le9OxT6VPfAOjOWQhKjdMo7h0MCQA8p
// kTav4/cKp4s+EW36b3/BVfxe2Fq22iR/SpzvTlMonfWtc+iMgID3eosy3skkAy04
// Z1qEp4z5S/klM1MDD2UCQAI4tU/GB5QJKzPd5jyxQYyCFZ7CUuM209/EgnXimiq7
// U1lTigYEjKqtFCREH9A7hKTphDzHcDdZir9Le6yhH8M=
// -----END RSA PRIVATE KEY-----`;
// const TOKEN_DECODE_KEY = `-----BEGIN PUBLIC KEY-----
// MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCVY8z2o8BgxVtVMb5mGQ5cSpve
// zXuZfZtwianNvHOgwK8zfDsOxkzxoW96liFK44JTahjHX1Beq1Ny1Hmirepg1/Ld
// sIFEMwp0nFDfRxrJZJDwWjTZAIOHh143PVqE4W4bA5tQm/VqY/bRY0UasCyrXzeL
// tLxEFgq+bE22OnbPCwIDAQAB
// -----END PUBLIC KEY-----`;

const verifyToken = (req, res, callback) => {
        const auth = req.headers['authorization'] || req.headers['Authorization'];
        const token = auth.replace('Bearer ', '');
        if(token) {
            return jwt.verify(token, process.env.TOKEN_DECODE_KEY, {algorithms: ['RS512']}, (err, decoded) => {
                if (err) {
                    if (err === 'invalid token')
                        return res.status(403).send('Unauthorized Access');
                    return res.status(500).send('Internal Server Error: Unable to verify token');
                }
                return callback(decoded);
            });
        }
    return res.status(500).send('Internal Server Error: Unable to verify token');
};


const createToken = (payload) => jwt.sign(payload, process.env.TOKEN_ENCODE_KEY, {algorithm:'RS512', expiresIn: 86400});

module.exports = {createToken, verifyToken};