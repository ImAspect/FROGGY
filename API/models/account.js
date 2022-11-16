module.exports = (_db) => {
	db = _db
	return accountModels
}

const config = require('config')

class accountModels {
	static async accountCreate(username, email, salt, verifier) {
		try {
			const result = await db.query(`INSERT INTO ${config.get('mysql.authDatabase')}.account (username, email, salt, verifier) VALUES (?, ?, ?, ?)`, [username, email, salt, verifier])
			return result
		} catch (err) {
			return err
		}
	}

	static async accountLogin(accountId, discordId) {
		try {
			const result = await db.query(`INSERT INTO ${config.get('mysql.authDatabase')}.account_discord (accountId, discordId, verified) VALUES (?, ?, ?)`, [accountId, discordId, 1])
			return result
		} catch (err) {
			return err
		}
	}

	static async getAccountByUsername(username) {
		try {
			const result = await db.query(`SELECT * FROM ${config.get('mysql.authDatabase')}.account WHERE username = ?`, [username])
			return result
		} catch (err) {
			return err
		}
	}

	static async getAccountByEmail(email) {
		try {
			const result = await db.query(`SELECT * FROM ${config.get('mysql.authDatabase')}.account WHERE email = ?`, [email])
			return result
		} catch (err) {
			return err
		}
	}

	static async getAccountVerifiedByDiscordId(discordId) {
		try {
			const result = await db.query(`SELECT * FROM ${config.get('mysql.authDatabase')}.account_discord WHERE discordId = ?`, [JSON.parse(discordId)])
			return result
		} catch (err) {
			return err
		}
	}

	static async getAccountAccessById(id) {
		try {
			const result = await db.query(`SELECT * FROM ${config.get('mysql.authDatabase')}.account_access WHERE ${config.get('core') === 'AC' ? 'id = ?' : config.get('core') === 'TC' || config.get('core') === 'SC' && 'AccountId = ?'}`, [id])
			return result
		} catch (err) {
			return err
		}
	}

	static async getAccountIdByCharacterGuid(guid) {
		try {
			const result = await db.query(`SELECT a.id FROM ${config.get('mysql.authDatabase')}.account AS a INNER JOIN ${config.get('mysql.charsDatabase')}.characters as cc WHERE cc.account =  a.id && cc.guid = ?`, [guid])
			return result
		} catch (err) {
			return err
		}
	}
}