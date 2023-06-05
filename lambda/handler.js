'use strict';

const { Client } = require('pg');
const { Redis } = require('ioredis');

const postgresOptions = {
  connectionString: '<POSTGRES-URL>'
};

const redisUrl = '<REDIS-URL>';

module.exports.processTransaction = async (event, context) => {
  const { Records } = event;

  const transactions = [];
  
  const postgresClient = new Client(postgresOptions);
  await postgresClient.connect();

  const redisClient = new Redis(redisUrl);

  for (let record in Records) {
    const data = JSON.parse(record.body);

    transactions.push(data.id);
    
    console.log(`Processing transaction ${data.id} for user ${data.user_id} (transactionId=${data.id})`);

    const cacheKey = `cache:users:${data.user_id}:balance`;
    
    console.log(`Consulting Redis for key: '${cacheKey}' (transactionId=${data.id})`)

    let balance = 0;
    
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log(`Found in cache (transactionId=${data.id})`)
      
      balance = JSON.parse(cached);
      balance += data.value;
    } else {
      console.log(`Not found in cache, consulting Postgres database (transactionId=${data.id})`)

      const query = await postgresClient.query(
        'SELECT COALESCE(SUM(value),0) AS total_value FROM transactions WHERE user_id = $1;', 
        [data.user_id]
      );

      if (query.rows.length === 0) {
        console.error(`Not found in Postgres database for user ${data.user_id} (transactionId=${data.id})`);
        throw new Error(`Not found in Postgres database for user ${data.user_id}`);
      }

      console.log(`Found in Postgres database for user ${data.user_id} (transactionId=${data.id})`);

      balance = response.rows[0].total_value;
    }

    console.log(`Saving updated value in cache (transactionId=${data.id})`);
    await redisClient.set(cacheKey, JSON.stringify(balance));

    await postgresClient.query('UPDATE transactions SET processed_at = NOW() WHERE id = $1', [data.id]);
  }
  
  postgresClient.end();
  redisClient.disconnect();

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      message: 'Users balance updated',
      transactions,
    }),
  };

  return response;
};
