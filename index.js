const { Client } = require('@elastic/elasticsearch');

async function searchDocuments(client) {
  //create the search params
  const searchParams = {
    index: 'events-testing-botson-reporting',
  };

  //get the docs
  const res = await client.search(searchParams);

  //create the groups the grouped data will be stored 
  const groupedData = {};
  const byGeo = {};
  const byBot = {};

  //loop through the docs and add them to to an appropriate group
  res.hits.hits.forEach(hit => {
    const event = hit._source;
    const userGeo = event.User_Geo;
    const botName = event.Bot_Name;

    //if the userGeo key appears for the first time 
    if (!groupedData[userGeo]) {
      groupedData[userGeo] = {};
      byGeo[userGeo] = [];
    }

    //if the botName key appears for the first time 
    if (!byBot[botName]) {
      byBot[botName] = [];
    }

    //if the botName key within the userGeo group appears for the first time 
    if (!groupedData[userGeo][botName]) {
      groupedData[userGeo][botName] = [];
    }

    //add the event to the groups
    groupedData[userGeo][botName].push(event);
    byGeo[userGeo].push(event);
    byBot[botName].push(event);
  });

  //calculate the event rate by User_Geo
  const rateByGeo = calculateEventRate(byGeo);

  //calculate the event rate by Bot_Name
  const rateByBot = calculateEventRate(byBot);

  console.log('by GEO', rateByGeo);
  console.log('by BOT', rateByBot);
}

function calculateEventRate(events) {
  //create the event rate object
  const res = {min: 1, max: 1, minKey: '', maxKey: ''};

  //calculate the event rate
  Object.entries(events).forEach(entry => {
    const [key, value] = entry;
    console.log(key, value);

    if (value.length <= res.min) {
      res.min = value.length;
      res.minKey = key;
    };
    if (value.length > res.max) {
      res.max = value.length;
      res.maxKey = key;
    };
  });

  return res;
}

async function main() {
  try {
    // Create an Elasticsearch client instance
    const client = new Client({
      node: 'https://botson-reporting-v2.es.us-central1.gcp.cloud.es.io',
      auth: {
        username: 'tech_lead_test',
        password: 'B4rTcumuqT5nz6F'
      }
    });

    // Test connection
    await client.ping(); 
    console.log('Connected to Elasticsearch cluster');

    //retrieve the documenst
    const documents = await searchDocuments(client);
    console.log('Retrieved documents:', documents);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the main function
main();

module.exports = {
  main,
  searchDocuments,
  calculateEventRate
};
