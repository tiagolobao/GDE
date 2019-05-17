
/*  GDE - Grau de deterioração do elemento  */

/* Dealing with environment */
process.argv.forEach((arg)=>{
  switch (arg) {
    case 'development':
      process.env.NODE_ENV = 'development';
      console.log('Entering in development mode');
      break;
    default:
    case 'production':
      process.env.NODE_ENV = 'production';
      break;
  }
});

/* Continues... */
require('./controller/init.js')(__dirname);
