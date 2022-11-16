import axios from 'axios'
import { API_URL } from '../config/api.json'

const getAllCharactersByDiscordId = async (data) => {
    const response = await axios.post(`${API_URL}/api/characters/discord/${data}`)
    return response.data
}

const getCharacterByGuid = async (data) => {
    const response = await axios.post(`${API_URL}/api/character/${data}`)
    return response.data
}

const getCharactersByAccountId = async (accountId) => {
    const response = await axios.post(`${API_URL}/api/characters/all/${accountId}`)
    return response.data
}

module.exports = {
    getAllCharactersByDiscordId,
    getCharacterByGuid,
    getCharactersByAccountId
}