function getClassByGender(genderId, classId) {
    switch (genderId) {
        case 0:
            switch (classId) {
                case 1:
                    return 'Guerrier'
                case 2:
                    return 'Paladin'
                case 3:
                    return 'Chasseur'
                case 4:
                    return 'Voleur'
                case 5:
                    return 'Prêtre'
                case 6:
                    return 'Chevalier de la mort'
                case 7:
                    return 'Chaman'
                case 8:
                    return 'Mage'
                case 9:
                    return 'Démoniste'
                case 11:
                    return 'Druide'
                default:
                    break
            }
        case 1:
            switch (classId) {
                case 1:
                    return 'Guerrière'
                case 2:
                    return 'Paladin'
                case 3:
                    return 'Chasseuse'
                case 4:
                    return 'Voleuse'
                case 5:
                    return 'Prêtresse'
                case 6:
                    return 'Chevalière de la mort'
                case 7:
                    return 'Chaman'
                case 8:
                    return 'Mage'
                case 9:
                    return 'Démoniste'
                case 11:
                    return 'Druidesse'
                default:
                    break
            }
        default:
            break
    }
}

function getRaceByGender(genderId, raceId) {
    switch (genderId) {
        case 0:
            switch (raceId) {
                case 1:
                    return 'Humain'
                case 2:
                    return 'Orc'
                case 3:
                    return 'Nain'
                case 4:
                    return 'Elfe de la nuit'
                case 5:
                    return 'Mort-vivant'
                case 6:
                    return 'Tauren'
                case 7:
                    return 'Gnome'
                case 8:
                    return 'Troll'
                case 10:
                    return 'Elfe de sang'
                case 11:
                    return 'Draeneï'
                default:
                    break
            }
        case 1:
            switch (raceId) {
                case 1:
                    return 'Humaine'
                case 2:
                    return 'Orque'
                case 3:
                    return 'Naine'
                case 4:
                    return 'Elfe de la nuit'
                case 5:
                    return 'Morte-vivante'
                case 6:
                    return 'Taurène'
                case 7:
                    return 'Gnome'
                case 8:
                    return 'Trollesse'
                case 10:
                    return 'Elfe de sang'
                case 11:
                    return 'Draeneï'
                default:
                    break
            }
        default:
            break
    }
}

module.exports = { 
    getClassByGender,
    getRaceByGender
}