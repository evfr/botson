module.exports = {
	mockedPingResponse: {},
	mockedSearchResponse: {
		hits: {
			hits: [
				{ _source: { User_Geo: 'geo1', Bot_Name: 'bot1' } },
				{ _source: { User_Geo: 'geo2', Bot_Name: 'bot2' } },
			],
		},
	},
	events: {
		'geo1': [],
		'geo2': [],
	}
};