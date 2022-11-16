import { SOAP_PORT, SOAP_IP, SOAP_USER, SOAP_PASSWORD } from '../config/soap.json'
import { SERVER_CORE } from '../config/server.json'

function soapCommand(command) {
	const http = require('http')
	return new Promise((resolve, reject) => {
		const req = http.request({
			port: SOAP_PORT,
			method: "POST",
			hostname: SOAP_IP,
			auth: `${SOAP_USER}:${SOAP_PASSWORD}`,
			headers: { 'Content-Type': 'application/xml' }
		}, res => {
			res.on('data', async d => {
				const xml2js = require('xml2js')
				const xml = await xml2js.parseStringPromise(d.toString())
				const body = xml["SOAP-ENV:Envelope"]["SOAP-ENV:Body"][0]
				const fault = body["SOAP-ENV:Fault"]

				if (fault) {
					resolve({
						faultCode: fault[0]["faultcode"][0],
						faultString: fault[0]["faultstring"][0],
					})

					return
				}

				const response = body["ns1:executeCommandResponse"]

				if (response) {
					resolve({
						result: response[0]["result"][0]
					})
					return
				}

				console.log(d.toString())
			})
		})

		req.write(
			'<SOAP-ENV:Envelope' +
			' xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"' +
			' xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/"' +
			' xmlns:xsi="http://www.w3.org/1999/XMLSchema-instance"' +
			' xmlns:xsd="http://www.w3.org/1999/XMLSchema"' +
			` ${SERVER_CORE === 'AC' ? 'xmlns:ns1="urn:AC">' : SERVER_CORE === 'TC' ? 'xmlns:ns1="urn:TC">' : SERVER_CORE === 'SC' && 'xmlns:ns1="urn:SC">'}` +
			'<SOAP-ENV:Body>' +
			'<ns1:executeCommand>' +
			'<command>' + command + '</command>' +
			'</ns1:executeCommand>' +
			'</SOAP-ENV:Body>' +
			'</SOAP-ENV:Envelope>'
		)

		req.end()
	})
}

module.exports = { soapCommand }
