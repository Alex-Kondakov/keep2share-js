//Keep2Share API v.2 example requests

const k2s = require('keep2share');

//Use fboom.me instead of keep2share.cc if you want interact with Fileboom
const keep2share = k2s.init('YOUR EMAIL HERE', 'YOUR PASSWORD HERE', 'keep2share.cc');


(async () => {
    await keep2share.login()
        .then(response => {
            console.log(response);
        })
    await keep2share.upload('/full/path/to/your/file.rar')
        .then( response => {
            console.log(response);
        })

})();