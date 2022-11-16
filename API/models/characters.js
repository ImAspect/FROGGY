module.exports = (_db) => {
	db = _db
	return characterModels
}

const config = require('config')
class characterModels {
	static async getCharactersByAccountId(accountId) {
		try {
			const result = await db.query(`SELECT guid, name, race, class, gender, online FROM ${config.get('mysql.charsDatabase')}.characters WHERE account = ?`, [accountId])
			return result
		} catch (err) {
			return err
		}
	}

	static async getCharacterByGuid(Guid) {
		try {
			const result = await db.query(`SELECT name, race, class, gender, level, money, online, totaltime, logout_time, health, creation_date FROM ${config.get('mysql.charsDatabase')}.characters WHERE guid = ?`, [Guid])
			return result
		} catch (err) {
			return err
		}
	}

	static async getCharactersByAccountId(accountId) {
		try {
			const result = await db.query(`SELECT guid, name, gender, class, race FROM ${config.get('mysql.charsDatabase')}.characters WHERE account = ?`, [accountId])
			return result
		} catch (err) {
			return err
		}
	}
}