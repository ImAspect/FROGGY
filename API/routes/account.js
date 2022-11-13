module.exports = (app, db) => {
    const crypto = require('crypto')
    const { createVerifier } = require('../custom_modules/SRP6')

    app.post('/api/account/add', async (req, res, next) => {
        const accountModels = require('../models/account')(db)
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
        const verifier = await createVerifier(username.toUpperCase(), password, salt)
        const result = await accountModels.accountCreate(username.toUpperCase(), email, salt, verifier)

        if (result.code) {
            return res.json({ status: 500, err: result.code })
        }

        return res.json({ status: 200, msg: 'Account create with success !' })

    })

    app.post('/api/account/login', async (req, res, next) => {
        const accountModels = require('../models/account')(db)
        const account = await accountModels.getAccountByUsername(req.body.username)

        if (account.length == 0) {
            return res.json({ status: 400, msg: 'Account not registered !' })
        }

        const verifier = await createVerifier(req.body.username.toUpperCase(), req.body.password, account[0].salt)

        if (JSON.stringify(account[0].verifier) != JSON.stringify(verifier)) {
            return res.json({ status: 401, msg: 'Bad password !' })
        }
        const result = await accountModels.accountLogin(account[0].id, req.body.discordId)

        if (result.code) {
            return res.json({ status: 500, err: result.code })
        }

        return res.json({ status: 200, msg: 'Account login with success !', account: account[0] })
    })

    app.get('/api/account/discord/:discordId', async (req, res, next) => {
        const accountModels = require('../models/account')(db)
        const result = await accountModels.getAccountVerifiedByDiscordId(req.params.discordId)

        if (result.code) {
            return res.json({ status: 500, err: result.code })
        }

        return res.json({ status: 200, result: result[0] })
    })

    app.get('/api/account/characters/:discordId', async (req, res, next) => {
        const accountModels = require('../models/account')(db)
        const characterModels = require('../models/characters')(db)
        const getAccountByDiscordId = await accountModels.getAccountVerifiedByDiscordId(req.params.discordId)
        const getCharactersByAccountId = await characterModels.getCharactersByAccountId(getAccountByDiscordId[0].accountId)

        if (getCharactersByAccountId.code) {
            return res.json({ status: 500, err: getCharactersByAccountId.code })
        }

        return res.json({ status: 200, result: getCharactersByAccountId })
    })

    app.get('/api/character/:Guid', async (req, res, next) => {
        const characterModels = require('../models/characters')(db)
        const getCharacterByGuid = await characterModels.getCharacterByGuid(req.params.Guid)

        if (getCharacterByGuid.code) {
            return res.json({ status: 500, err: getCharacterByGuid.code })
        }

        return res.json({ status: 200, result: getCharacterByGuid })
    })

    app.get('/api/account/access/:id', async (req, res, next) => {
        const accountModels = require('../models/account')(db)
        const getAccountAccessById = await accountModels.getAccountAccessById(req.params.id)

        if (getAccountAccessById.code) {
            return res.json({ status: 500, err: getAccountAccessById.code })
        }

        return res.json({ status: 200, result: getAccountAccessById })
    })

    app.get('/api/account/character/:guid', async (req, res, next) => {
        const accountModels = require('../models/account')(db)
        const getAccountIdByCharacterGuid = await accountModels.getAccountIdByCharacterGuid(req.params.guid)
        
        if (getAccountIdByCharacterGuid.code) {
            return res.json({ status: 500, err: getAccountIdByCharacterGuid.code })
        }

        return res.json({ status: 200, result: getAccountIdByCharacterGuid })
    })
}