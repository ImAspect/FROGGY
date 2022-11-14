const axios = require('axios')
const { API_URL } = require('../config/api.json')

const getAllTickets = () => {
    return axios.get(API_URL+`/api/tickets/all`)
    .then((response) => {
        return response.data
    })
}

const getTicketById = (data) => {
    return axios.get(API_URL+`/api/ticket/${data}`)
    .then((response) => {
        return response.data
    })
}

module.exports = {
    getAllTickets,
    getTicketById
}