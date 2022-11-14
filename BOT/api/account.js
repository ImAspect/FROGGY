const axios = require('axios')
const { API_URL } = require('../config/api.json')

const createAccount = (data) => {
    return axios.post(API_URL+'/api/account/add', data)
    .then((response) => {
        return response.data
    })
}

const loginAccount = (data) => {
    return axios.post(API_URL+'/api/account/discord/login', data)
    .then((response) => {
        return response.data
    })
}

const getAccountVerifiedByDiscordId = (data) => {
    return axios.get(API_URL+`/api/account/discord/${data}`)
    .then((response) => {
        return response.data
    })
}

const getAccountAccessById = (data) => {
    return axios.get(API_URL+`/api/account/access/${data}`)
    .then((response) => {
        return response.data
    })
}

const getAccountIdByCharacterGuid = (data) => {
    return axios.get(API_URL+`/api/account/character/${data}`)
    .then((response) => {
        return response.data
    })
}

module.exports = {
    createAccount,
    loginAccount,
    getAccountVerifiedByDiscordId,
    getAccountAccessById,
    getAccountIdByCharacterGuid
}