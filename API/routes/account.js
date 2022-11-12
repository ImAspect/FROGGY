module.exports = (app, db) => {
    const crypto = require('crypto')
    const { createVerifier } = require('../custom_modules/SRP6')
    const accountModels = require('../models/account')(db)

    app.post('/api/account/add', async (req, res, next) => {
        const account = await accountModels.getAccountByUsername(req.body.username)
        const accountEmail = await accountModels.getAccountByEmail(req.body.email)
        const validateEmail = (email) => {
            return String(email)
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                )
        }

        if (account.length > 0) {
            return res.json({ status: 400, msg: 'Username already registered !' })
        }

        if (!req.body.username.match('^[a-z0-9A-Z]{3,16}$')) {
            return res.json({ status: 401, msg: 'Username require 3 min or 16 characters maximum and cannot contain special characters !' })
        }

        if (accountEmail.length > 0) {
            return res.json({ status: 402, msg: 'Email already registered !' })
        }

        if (!validateEmail(req.body.email) || validateEmail(req.body.email) === false) {
            return res.json({ status: 403, msg: 'Email format not valid !' })
        }

        if (req.body.password.length < 8 || req.body.password.length > 16) {
            return res.json({ status: 404, msg: 'Password require 8 min or 16 max chars !' })
        }

        const username = req.body.username
        const email = req.body.email
        const password = req.body.password
        const salt = crypto.randomBytes(32)
        const verifier = await createVerifier(username, password, salt)
        const result = await accountModels.accountCreate(username, email, salt, verifier)

        if (result.code) {
            return res.json({ status: 500, err: result.code })
        }

        return res.json({ status: 200, msg: 'Account create with success !' })

    })
}