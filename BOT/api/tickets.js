import axios from 'axios'
import { API_URL } from '../config/api.json'

const getAllTickets = async () => {
    const response = await axios.get(`${API_URL}/api/tickets/all`)
    return response.data
}

const getTicketById = async (data) => {
    const response = await axios.get(`${API_URL}/api/ticket/${data}`)
    return response.data
}

module.exports = {
    getAllTickets,
    getTicketById
}