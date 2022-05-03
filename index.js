// (c) Alex Kondakov
// MoneyPlatform API v.2 implementation

const https = require('https');
const Promise = require('promise');
const fs = require('fs');
const request  = require('request');
const urlAPI  = require('url');

exports.init = (username, password, hostname) => {
    return {
        _username: username,
        _password: password,
        _hostname: hostname,
        _token: '',
        _available_traffic: 0,
        _account_expires: '',
        _balance: 0,
        _domains: [],
        _folders: [],
        set username (newUsername) {
            this._username = newUsername;
        },
        get username () {
            return this._username;
        },
        set password (newPassword) {
            this._password = newPassword;
        },
        get password () {
            return this._password;
        },
        set token (newToken) {
            this._token = newToken;
        },
        get token () {
            return this._token;
        },
        get available_traffic () {
            return this._available_traffic;
        },
        get account_expires () {
            return this._account_expires;
        },
        get balance () {
            return this._balance;
        },
        get domains () {
            return this._domains;
        },
        get folders () {
            return this._folders;
        },
        //Send request. First parameter is API url end point. Second parameter is object contain request body. Returns promise
        sendRequest (endPoint, requestBody) {
            return new Promise ((resolve, reject) => {
                let data = '';
                const requestBodyJSON = JSON.stringify(requestBody);
                const options = {
                    hostname: this._hostname,
                    port: 443,
                    path: `/${endPoint}`,
                    method: 'POST',
                }
                const makeRequest = https.request(options, response => {
                    response.on('data', chunk => {
                        data += chunk.toString();
                    });
                    response.on('end', () => {
                        resolve({
                            code: response.statusCode,
                            data: JSON.parse(data)
                        });
                    });
                    response.on('error', error => {
                        reject(error);
                    });
                })
                makeRequest.write(requestBodyJSON);
                makeRequest.end();
            })
        },
        //Passing login parameters to this.setRequest. Returns promise with response body resolved. Saves authorization token to this._token
        login () {
            return this.sendRequest('api/v2/login', {"username":this._username, "password":this._password})
                .then(response => {
                    this._token = response.data['auth_token'];
                    return response;
                });
        },
        //Saves account info to object properties. Returns promise with response body resolved
        accountInfo () {
            return this.sendRequest('api/v2/accountInfo', {"auth_token":this._token})
                .then(response => {
                    this._available_traffic = response.data['available_traffic'];
                    this._account_expires = response.data['account_expires'];
                    return response;
                });
        },
        //Request reCaptcha challenge parameters. Returns promise with response body resolved
        requestReCaptcha () {
            return this.sendRequest('api/v2/requestReCaptcha', {})
                .then(response => {
                    return response;
                });
        },
        //Test request to API in order to check if it is accecible. Returns promise with response body resolved
        test () {
            return this.sendRequest('api/v2/test', {})
                .then(response => {
                    return response;
                });
        },
        //Saves account balance to object properties. Returns promise with response body resolved
        getBalance () {
            return this.sendRequest('api/v2/getBalance', {"auth_token":this._token})
                .then(response => {
                    this._balance = response.data['balance'];
                    return response;
                });
        },
        //Saves domains list, available for partner. Returns promise with response body resolved
        getDomainsList () {
            return this.sendRequest('api/v2/getDomainsList', {"auth_token":this._token})
                .then(response => {
                    this._domains = response.data['domains'];
                    return response;
                });
        },
        //Saves folders list. Returns promise with response body resolved
        getFoldersList () {
            return this.sendRequest('api/v2/getFoldersList', {"auth_token":this._token})
                .then(response => {
                    this._folders = response.data['foldersList'];
                    return response;
                });
        },
        //Name - new folder name. Parent - parent directory, access - public, private, premium. Returns promise with response body resolved
        createFolder (name, parent = '/', access = 'public') {
            return this.sendRequest('api/v2/createFolder', {"auth_token":this._token, "name":name, "parent":parent, "access":access})
                .then(response => {
                    return response;
                });
        },
        //FIles info request. parent - file folder. Limit - maximum files number in response. Offset - offset from begining or selection. Sort - examples: {name:1}, {name:-1}, {date_created:1}, {date_created:-1}. only_available - include available files only. extended_info - includes: abuses, storage_object, size, date_download_last, downloads, access, content_type.Returns promise with response body resolved
        getFilesList (parent = '/', limit = 10, offset = 0, sort = {"date_created":1}, only_available = false, extended_info = false) {
            return this.sendRequest('api/v2/getFilesList', {"auth_token":this._token, "parent":parent, "limit":limit, "offset":offset, "sort":sort, "only_available":only_available, "extended_info":extended_info})
                .then(response => {
                    return response;
                });
        },
        //Information by files ID. Returns promise with response body resolved
        getFilesInfo (ids, extended_info=false) {
            return this.sendRequest('api/v2/getFilesInfo', {"auth_token":this._token, "ids":ids, "extended_info":extended_info})
                .then(response => {
                    return response;
                });
        },
        //Files Update. new_access values: public, private, premium. Returns promise with response body resolved
        updateFiles (ids, new_name, new_parent='/', new_access='public', new_is_public=false) {
            return this.sendRequest('api/v2/updateFiles', {"auth_token":this._token, "ids":ids, "new_name":new_name, "new_parent":new_parent, "new_access":new_access, "new_is_public":new_is_public})
                .then(response => {
                    return response;
                });
        },
        //Removing files by IDs. Returns promise with response body resolved
        deleteFiles (ids) {
            return this.sendRequest('api/v2/deleteFiles', {"auth_token":this._token, "ids":ids})
                .then(response => {
                    return response;
                });
        },
        //Search file by it's HASH. Searches on entire cloud platform. Returns promise with response body resolved
        findFile (md5) {
            return this.sendRequest('api/v2/findFile', {"auth_token":this._token, "md5":md5})
                .then(response => {
                    return response;
                });
        },
        //Create file basing on hash sum. If cloud already have file with this hash, this method will mare a copy. Returns promise with response body resolved
        createFileByHash (hash, name, parent="/", access="public") {
            return this.sendRequest('api/v2/createFileByHash', {"auth_token":this._token, "hash":hash, "name":name, "parent":parent, "access":access})
                .then(response => {
                    return response;
                });
        },
        //File or folder(it's files) status by ID. Returns promise with response body resolved
        getFileStatus (id, limit=10, offset=0) {
            return this.sendRequest('api/v2/getFileStatus', {"auth_token":this._token, "id":id, "limit":limit, "offset":offset})
                .then(response => {
                    return response;
                });
        },
        //Request for upload form data. Returns promise with response body resolved
        getUploadFormData (parent_id="/", preferred_node="") {
            return this.sendRequest('api/v2/getUploadFormData', {"auth_token":this._token, "parent_id":parent_id, "preferred_node":preferred_node})
                .then(response => {
                    return response;
                });
        },
        //Upload local file. Returns promise with uploading result body resolved
        upload (filePath, parent_id="/", preferred_node="") {
            return this.sendRequest('api/v2/getUploadFormData', {"auth_token":this._token, "parent_id":parent_id, "preferred_node":preferred_node})
                .then(response => {
                    let formData = {};
                    if (response.code == 200) {
                        formData = {
                            ajax: `${response.data.form_data.ajax}`,
                            signature: response.data.form_data.signature,
                            params: response.data.form_data.params
                        }
                        formData[response.data.file_field] = fs.createReadStream(filePath);
                    } else {
                        formData = {error: 'No form data received'};
                    }
                    return {url: response.data.form_action, formData: formData}
                })
                .then(response => {
                    return new Promise ((resolve, reject) => {
                        request.post(response, (err, httpResponse, body) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(JSON.parse(body));
                            }
                        })
                    })
                })
        },
        //Uploads all files from passed array
        uploadAll (filePaths, parent_id="/", preferred_node="") {
            return new Promise ((resolve, reject) => {
                (async () => {
                     try {
                         //Uploaded links
                        let uploaded = []
                        for (const file of filePaths) {
                            await this.upload(file, parent_id, preferred_node)
                                .then(response => uploaded.push(response))
                                .catch(error => reject('filehostKeep2share.js uploadAll ' + error))
                        }
                        resolve(uploaded)
                    }
                    catch (err) {
                        reject('filehostKeep2share.js uploadAll ' + err)
                    }
                })()
            })
        },
        //Add remote upload. urls - array of remote urls. Returns promise with response body resolved
        remoteUploadAdd (urls) {
            return this.sendRequest('api/v2/remoteUploadAdd', {"auth_token":this._token, "urls":urls})
                .then(response => {
                    return response;
                });
        },
        //Remote uploads status. ids - array of remote uploads ids. Returns promise with response body resolved
        remoteUploadStatus (ids) {
            return this.sendRequest('api/v2/remoteUploadStatus', {"auth_token":this._token, "ids":ids})
                .then(response => {
                    return response;
                });
        },
        //Remote upload. Returns promise with response body resolved
        remoteUpload (url) {
            const link = [];
            link.push(url);
            let uploadResult;

            return new Promise ((resolve, reject) => {
                (async () => {
                    await this.remoteUploadAdd(link)
                    .then(response => {
                        add = response;
                        return response;
                    })
                    .then(response => {
                        let data = {};
                        if (response.code == 200) {
                            data = response.data;
                        } else {
                            data = {error: 'Remote upload add fail'}
                        }
                        return data;                   
                    })
                    .then(response => {
                        const id = [];
                        id.push(response.acceptedUrls[0].id);
                        return id;
                    })
                    .then(id => {
                        return new Promise ((res, rej) => {
                           let intervalReq = setInterval(() => {
                               (async () => {
                                    await this.remoteUploadStatus(id)
                                    .then(uploadStatus => {
                                        if (uploadStatus.data.uploads[id[0]].status == 3) {
                                                uploadResult = uploadStatus.data;
                                                res(uploadResult);
                                                clearInterval(intervalReq);
                                        }
                                    })
                                })();
                            }, 5000)
                        })
                        .then(response => response)
                    })
                    await resolve(uploadResult);
                })();
            })
        },
        //Get url to download
        getUrl (file_id, free_download_key, captcha_challenge, captcha_response, url_referrer) {
            return this.sendRequest('api/v2/getUrl', {"auth_token":this._token, "file_id":file_id, "free_download_key":free_download_key, "captcha_challenge":captcha_challenge, "captcha_response":captcha_response, "url_referrer":url_referrer})
                .then(response => {
                    return response;
                });
        },
        //Download file by it's URL. path is destination directory path without file name
        download (fileUrl, path) {
            return new Promise ((resolve, reject) => {
                let fileId = urlAPI.parse(fileUrl).pathname.split('/')[2];
                if (fileId) {
                    resolve(fileId);
                } else {
                    reject('Wrong URL')
                }
            })
            .then(response => this.getUrl(response))
            .then(response => {
                if (response.data.code == 200) {
                    fileName = response.data.url.split('=');
                    fileName = fileName[fileName.length - 1];
                    return {
                        name: fileName,
                        url: response.data.url
                    }
                } else {
                    return response.data.message;
                }
            })
            .then(response => {
                return new Promise ((res, rej) => {
                    https.get(response.url, (r) => {
                        const fileStream = fs.createWriteStream(path + '/' + response.name);
                        r.pipe(fileStream);
                        fileStream.on('finish', () => {
                            fileStream.close();
                            res('done');
                        })
                    })
                })
            })
        }

    }
}