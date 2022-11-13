module.exports = (_db) => {
    db = _db
    return characterModels
}

class characterModels {
    static async getCharactersByAccountId(accountId) {
		return db.query('SELECT name, race, class, gender, online FROM Chars_DEV.characters WHERE account = ?', [accountId])
		.then((result) => {
			return result
		})
		.catch((err) => {
			return err
		})
	}
}