import { getAccountVerifiedByDiscordId } from '../api/account'

async function isLogin(discordId) {
    let verified

    await getAccountVerifiedByDiscordId(discordId)
        .then((res) => {
            if (res.result === false) {
                verified = false
            } else {
                verified = res.result
            }
        })
    
    if (verified === false) {
        return false
    } else {
        return verified
    }
}

module.exports = { isLogin }