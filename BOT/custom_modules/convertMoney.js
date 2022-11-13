function convertMoney(money) {
    const moneyIg = JSON.stringify(money).split("")
    if (moneyIg.length > 4) {
        const moneyGold = money / 10000
        const gold = Math.trunc(moneyGold)
        const silver = JSON.parse((moneyIg[(moneyIg.length - 3) - 1]) + (moneyIg[(moneyIg.length - 2) - 1]))
        const copper = JSON.parse((moneyIg[(moneyIg.length - 1) - 1]) + (moneyIg[(moneyIg.length - 0) - 1]))
        return `${gold} or ${silver} argent ${copper} cuivre`
    } else if (moneyIg.length === 4) {
        const gold = 0
        const silver = moneyIg[0] + moneyIg[1]
        const copper = moneyIg[2] + moneyIg[3]
        return `${gold} or ${silver} argent ${copper} cuivre`
    } else if (moneyIg.length === 2 || moneyIg.length === 1) {
        if (moneyIg.length === 1) {
            const gold = 0
            const silver = 0
            const copper = moneyIg[0]
            return `${gold} or ${silver} argent ${copper} cuivre`
        } else if (moneyIg.length === 2) {
            const gold = 0
            const silver = 0
            const copper = moneyIg[0] + moneyIg[1]
            return `${gold} or ${silver} argent ${copper} cuivre`
        }
    }
}

module.exports = { convertMoney }