const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter password to hash: ', (password) => {
  bcrypt.hash(password, 10).then(hash => {
    console.log('\nPassword hash:');
    console.log(hash);
    console.log('\nAdd this to your .env.local file:');
    console.log(`ADMIN_PASSWORD_HASH=${hash}`);
    rl.close();
  });
});
