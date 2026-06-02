const http = require('http');

http.get('http://localhost:3000/api/docs-json', (res) => {
  if (res.statusCode >= 200 && res.statusCode < 300) {
    process.exit(0);
  } else {
    console.error(`Error: Backend API returned status code ${res.statusCode}`);
    process.exit(1);
  }
}).on('error', (err) => {
  console.error('Error: Backend API is not running at http://localhost:3000/api/docs-json. Please start the backend server before generating the API client.');
  process.exit(1);
});
