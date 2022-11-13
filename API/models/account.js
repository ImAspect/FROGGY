module.exports = (_db) => {
    db = _db
    return accountModels
}

class accountModels {
    static async accountCreate(username, email, salt, verifier) {
        return db.query('INSERT INTO account (username, email, salt, verifier) VALUES (?, ?, ?, ?)', [username, email, salt, verifier])
            .then((result) => {
                return result
            })
            .catch((err) => {
                return err
            })
    }

	static async accountLogin(accountId, discordId) {
		return db.query('INSERT INTO account_discord (accountId, discordId, verified) VALUES (?, ?, ?)', [accountId, discordId, 1])
			.then((result) => {
				return result
			})
			.catch((err) => {
				return err
			})
	}

	static async getAccountByUsername(username) {
		return db.query('SELECT * FROM account WHERE username = ?', [username])
		.then((result) => {
		    return result
		})
		.catch((err) => {
			return err
		})
	}

    static async getAccountByEmail(email) {
		return db.query('SELECT * FROM account WHERE email = ?', [email])
		.then((result) => {
		    return result
		})
		.catch((err) => {
			return err
		})
	}

	static async getAccountVerifiedByDiscordId(discordId) {
		return db.query('SELECT * FROM account_discord WHERE discordId = ?', [JSON.parse(discordId)])
		.then((result) => {
			return result
		})
		.catch((err) => {
			return err
		})
	}

	static async getAccountAccessById(id) {
		return db.query('SELECT * FROM account_access WHERE id = ?', [id])
		.then((result) => {
			return result
		})
		.catch((err) => {
			return err
		})
	}
}