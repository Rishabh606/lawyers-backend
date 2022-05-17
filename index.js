const app = require('./app.js');
const logger = require('./utils/winston-logger')
const PORT = process.env.PORT||8080;

//listening to server on PORT
app.listen(PORT, () => {
  logger.info('Example app listening at http://localhost:%s',PORT);
});