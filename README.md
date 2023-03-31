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
import * as API from 'keep2share'

const k2s = API.init('YOUR EMAIL HERE', 'YOUR PASSWORD HERE', 'keep2share.cc')

await k2s.login()
    .then(response => {
        console.log(response)
    })
await k2s.upload('/full/path/to/your/file.rar')
    .then( response => {
        console.log(response)
    })

```

## Downloading:

```javascript
//Use fboom.me instead of keep2share.cc if you want interact with Fileboom
import * as API from 'keep2share'

const k2s = API.init('YOUR EMAIL HERE', 'YOUR PASSWORD HERE', 'keep2share.cc')

await k2s.login()
    .then(response => {
        console.log(response);
    })
await k2s.download('https://k2s.cc/file/sdfgsdfgsdfsdfh/file.rar', '/path/to/assets')
    .then( response => {
        console.log(response);
    })


```