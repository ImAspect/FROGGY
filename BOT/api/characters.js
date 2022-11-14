const axios = require('axios')
const { API_URL } = require('../config/api.json')

const getAllCharactersByDiscordId = (data) => {
    return axios.get(API_URL+`/api/characters/discord/${data}`)
    .then((response) => {
        return response.data
    })
}

const getCharacterByGuid = (data) => {
    return axios.get(API_URL+`/api/character/${data}`)
    .then((response) => {
        return response.data
    })
}

const getCharactersByAccountId = (accountId) => {
    return axios.get(API_URL+`/api/characters/all/${accountId}`)
    .then((response) => {
        return response.data
    })
}

module.exports = {
    getAllCharactersByDiscordId,
    getCharacterByGuid,
    getCharactersByAccountId
}