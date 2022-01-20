# Introduction

Node.Js implementation of Keep2Share and Fileboom APIs.

# Installation

```shell
# cd /your/projects/dir
# git clone https://github.com/Alex-Kondakov/keep2share-js.git
# cd keep2share-js
# npm install
```

# Usage

## Uploading:

```javascript
const k2s = require('../libs/keep2share');

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
```

## Downloading:

```javascript
const k2s = require('../libs/keep2share');

//Use fboom.me instead of keep2share.cc if you want interact with Fileboom
const keep2share = k2s.init('YOUR EMAIL HERE', 'YOUR PASSWORD HERE', 'keep2share.cc');


(async () => {
    await keep2share.login()
        .then(response => {
            console.log(response);
        })
    await keep2share.download('https://k2s.cc/file/b8978a5bbc118/simplehtmldom_1_9_1.zip', '/path/to/assets/')
        .then( response => {
            console.log(response);
        })

})();
```