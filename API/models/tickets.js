module.exports = (_db) => {
	db = _db
	return ticketsModels
}

const config = require('config')
class ticketsModels {
	static async getAllTickets() {
		try {
			const result = await db.query(`SELECT * FROM ${config.get('mysql.charsDatabase')}.gm_ticket WHERE completed = 0 LIMIT 10`)
			return result
		} catch (err) {
			return err
		}
	}

	static async getTicketById(id) {
		try {
			const result = await db.query(`SELECT * FROM ${config.get('mysql.charsDatabase')}.gm_ticket WHERE id = ? && completed = 0`, [id])
			return result
		} catch (err) {
			return err
		}
	}
}