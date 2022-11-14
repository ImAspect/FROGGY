module.exports = (_db) => {
    db = _db
    return ticketsModels
}

const config = require('config')
class ticketsModels {
	static async getAllTickets() {
		return db.query(`SELECT * FROM ${config.get('mysql.charsDatabase')}.gm_ticket WHERE completed = 0`)
		.then((result) => {
			return result
		})
		.catch((err) => {
			return err
		})
	}

	static async getTicketById(id) {
		return db.query(`SELECT * FROM ${config.get('mysql.charsDatabase')}.gm_ticket WHERE id = ? && completed = 0`, [id])
		.then((result) => {
			return result
		})
		.catch((err) => {
			return err
		})
	}
}