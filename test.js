const { URL } = require('node:url');

const databaseUrl = 'postgres://username:password@localhost:5432/my_db?sslmode=require';
const parsedUrl = new URL(databaseUrl);

console.log('Protocol:', parsedUrl.protocol); // postgres:
console.log('Username:', parsedUrl.username); // username
console.log('Password:', parsedUrl.password); // password
console.log('Hostname:', parsedUrl.hostname); // localhost
console.log('Port:', parsedUrl.port);       // 5432
console.log('Pathname:', parsedUrl.pathname); // /my_db
console.log('Search Params (query):', parsedUrl.searchParams.get('sslmode')); // require