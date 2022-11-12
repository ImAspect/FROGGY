const axios = require('axios')
const { API_URL } = require('../config.json')

const createAccount = (data) => {
    return axios.post(API_URL+'/api/account/add', data)
    .then((response) => {
        return response.data
    })
}

module.exports = {
    createAccount,
}