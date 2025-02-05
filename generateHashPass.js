import bcrypt from 'bcrypt'
async function GenerateHashPassForAdmin(rawPass) {
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(rawPass, salt, function(err, hash) {
           console.log(hash)
        });
    });
}
const pass = "YourPass"
GenerateHashPassForAdmin(pass)
//store in mongodb