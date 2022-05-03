# Introduction

Node.Js implementation of Keep2Share and Fileboom APIs.

# Installation

```shell
# cd /your/project/directory
# npm install keep2share --save
```

# Usage

## Uploading:

```javascript
//Use fboom.me instead of keep2share.cc if you want interact with Fileboom
const keep2share = require('keep2share').init('YOUR EMAIL HERE', 'YOUR PASSWORD HERE', 'keep2share.cc')

(async () => {
    await keep2share.login()
        .then(response => {
            console.log(response)
        })
    await keep2share.upload('/full/path/to/your/file.rar')
        .then( response => {
            console.log(response)
        })

})()
```

## Downloading:

```javascript
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
```