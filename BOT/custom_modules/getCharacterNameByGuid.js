function getCharacterNameByGuid(characterGuid) {
    const { getCharacterNameByGuid } = require('../Api/account')
    getCharacterNameByGuid(characterGuid)
    .then((res) => {
        if (res.status === 200) {
            console.log(res.result)
        }
    })
}

module.exports = { getCharacterNameByGuid }