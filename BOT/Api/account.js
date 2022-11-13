const axios = require('axios')
const { API_URL } = require('../config.json')

const createAccount = (data) => {
    return axios.post(API_URL+'/api/account/add', data)
    .then((response) => {
        return response.data
    })
}

const loginAccount = (data) => {
    return axios.post(API_URL+'/api/account/login', data)
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

const getAllCharactersByDiscordId = (data) => {
    return axios.get(API_URL+`/api/account/characters/${data}`)
    .then((response) => {
        return response.data
    })
}

const getCharacterByGuid = (data) => {
    return axios.get(API_URL+`/api/account/character/${data}`)
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

const getAllTickets = () => {
    return axios.get(API_URL+`/api/characters/tickets/all`)
    .then((response) => {
        return response.data
    })
}

module.exports = {
    createAccount,
    loginAccount,
    getAccountVerifiedByDiscordId,
    getAllCharactersByDiscordId,
    getCharacterByGuid,
    getAccountAccessById,
    getAllTickets
}