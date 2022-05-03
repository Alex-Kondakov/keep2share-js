//Keep2Share API v.2 example requests

//Use fboom.me instead of keep2share.cc if you want interact with Fileboom
const keep2share = require('keep2share').init('YOUR EMAIL HERE', 'YOUR PASSWORD HERE', 'keep2share.cc')

(async () => {
    await keep2share.login()
        .then(response => {
            console.log(response);
        })
    await keep2share.download('https://k2s.cc/file/b8978a5bbc118/simplehtmldom_1_9_1.zip', '/path/to/assets/')
        .then( response => {
            console.log(response);
        })

})()