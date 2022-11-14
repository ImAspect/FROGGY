function convertSecondsToTime(secondsInTime) {
    time_seconds = secondsInTime

    dateObj = new Date(time_seconds * 1000)
    hours = dateObj.getUTCHours()
    minutes = dateObj.getUTCMinutes()
    seconds = dateObj.getSeconds()

    return `${hours.toString().padStart(2, '0')
        + ' h ' + minutes.toString().padStart(2, '0')
        + ' m ' + seconds.toString().padStart(2, '0')
        + ' s '}`
}

module.exports = { convertSecondsToTime }