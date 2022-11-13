module.exports = (_db) => {
    db = _db
    return characterModels
}

class characterModels {
    static async getCharactersByAccountId(accountId) {
		return db.query('SELECT guid, name, race, class, gender, online FROM Chars_DEV.characters WHERE account = ?', [accountId])
		.then((result) => {
			return result
		})
		.catch((err) => {
			return err
		})
	}

	static async getCharacterByGuid(Guid) {
		return db.query('SELECT name, race, class, gender, level, money, online, totaltime, logout_time, health, creation_date FROM Chars_DEV.characters WHERE guid = ?', [Guid])
		.then((result) => {
			return result
		})
		.catch((err) => {
			return err
		})
	}
}