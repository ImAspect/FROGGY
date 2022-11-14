module.exports = (_db) => {
    db = _db
    return accountModels
}

const config = require('config')

class accountModels {
    static async accountCreate(username, email, salt, verifier) {
        return db.query(`INSERT INTO ${config.get('mysql.authDatabase')}.account (username, email, salt, verifier) VALUES (?, ?, ?, ?)`, [username, email, salt, verifier])
            .then((result) => {
                return result
            })
            .catch((err) => {
                return err
            })
    }

	static async accountLogin(accountId, discordId) {
		return db.query(`INSERT INTO ${config.get('mysql.authDatabase')}.account_discord (accountId, discordId, verified) VALUES (?, ?, ?)`, [accountId, discordId, 1])
			.then((result) => {
				return result
			})
			.catch((err) => {
				return err
			})
	}

	static async getAccountByUsername(username) {
		return db.query(`SELECT * FROM ${config.get('mysql.authDatabase')}.account WHERE username = ?`, [username])
		.then((result) => {
		    return result
		})
		.catch((err) => {
			return err
		})
	}

    static async getAccountByEmail(email) {
		return db.query(`SELECT * FROM ${config.get('mysql.authDatabase')}.account WHERE email = ?`, [email])
		.then((result) => {
		    return result
		})
		.catch((err) => {
			return err
		})
	}

	static async getAccountVerifiedByDiscordId(discordId) {
		return db.query(`SELECT * FROM ${config.get('mysql.authDatabase')}.account_discord WHERE discordId = ?`, [JSON.parse(discordId)])
		.then((result) => {
			return result
		})
		.catch((err) => {
			return err
		})
	}

	static async getAccountAccessById(id) {
		return db.query(`SELECT * FROM ${config.get('mysql.authDatabase')}.account_access WHERE id = ?`, [id])
		.then((result) => {
			return result
		})
		.catch((err) => {
			return err
		})
	}

	static async getAccountIdByCharacterGuid(guid) {
		return db.query(`SELECT a.id FROM ${config.get('mysql.authDatabase')}.account AS a INNER JOIN ${config.get('mysql.charsDatabase')}.characters as cc WHERE cc.account =  a.id && cc.guid = ?`, [guid])
		.then((result) => {
			return result
		})
		.catch((err) => {
			return err
		})
	}
}