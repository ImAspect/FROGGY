const { getAccountAccessById } = require('../Api/account')

async function isGm(accountId) {
    let access

    await getAccountAccessById(accountId)
        .then((res) => {
            if (res.result === false) {
                access = false
            } else {
                access = res.result
            }
        })
    
    if (access === false) {
        return false
    } else {
        return access
    }
}

module.exports = { isGm }