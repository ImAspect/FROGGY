import axios from 'axios'
import { API_URL } from '../config/api.json'

const createAccount = async (data) => {
    const response = await axios.post(`${API_URL}/api/account/add`, data)
    return response.data
}

const loginAccount = async (data) => {
    const response = await axios.post(`${API_URL}/api/account/discord/login`, data)
    return response.data
}

const getAccountVerifiedByDiscordId = async (data) => {
    const response = await axios.post(`${API_URL}/api/account/discord/${data}`)
    return response.data
}

const getAccountAccessById = async (data) => {
    const response = await axios.post(`${API_URL}/api/account/access/${data}`)
    return response.data
}

const getAccountIdByCharacterGuid = async (data) => {
    const response = await axios.post(`${API_URL}/api/account/character/${data}`)
    return response.data
}

module.exports = {
    createAccount,
    loginAccount,
    getAccountVerifiedByDiscordId,
    getAccountAccessById,
    getAccountIdByCharacterGuid
}