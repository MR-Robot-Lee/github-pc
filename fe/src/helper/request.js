function request(method, url, options) {
    return new Promise(function (resolve, reject) {
        options = options || {};
        var ajax = $.ajax;
        ajax({
            url: window.API_PATH + url,
            data: (method.toUpperCase() === 'GET' || method.toUpperCase === "DELETE") ? options.qs : JSON.stringify(options.body),
            type: method.toUpperCase(),
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            xhrFields: {withCredentials: true},
            timeout: 30000,
            crossDomain: true,
            success: function (data) {
                if (data.code === 1) {
                    resolve(data);
                } else if (data.code === 7) {
                    resolve(data);
                } else if (data.code === 14) {
                    resolve(data);
                } else if (data.code === 16) {
                    window.localStorage.setItem('user', '')
                    if (top.location) {
                        top.location.href = '/login';
                    } else {
                        window.location.href = '/login';
                    }
                    return false;
                } else if (data.code === 17) {
                    resolve(data);
                } else {
                    alert(data.desc);
                    reject(data.desc);
                }
            },
            error: function (err) {
                // alert(JSON.stringify(err) + err.statusText);
                reject(err);
            }
        });
    });
}

function upload(file, progress, url) {
    return new Promise(function (resolve, reject) {
        var ajax = $.ajax;
        var formData = new FormData();
        formData.append('file', file);
        ajax({
            url: url ? window.API_PATH + url : window.API_PATH + '/customer/attach/upload',
            type: 'POST',
            processData: false,
            contentType: false,
            xhrFields: {withCredentials: true},
            data: formData,
            crossDomain: true,
            success: function (data) {
                if (data.code === 1) {
                    resolve(data);
                } else if (data.code === 7) {
                    resolve(data);
                } else if (data.code === 14) {
                    resolve(data);
                } else if (data.code === 16) {
                    top.location.href = '/login';
                } else {
                    alert(data.desc);
                    reject(data.desc);
                }
            },
            error: function (err) {
                // alert(JSON.stringify(err) + err.statusText);
                reject(err);
            },
            xhr: function () {
                var xhr = $.ajaxSettings.xhr();
                if (xhr.onprogress === undefined) {
                    return xhr;
                }
                xhr.upload.addEventListener('progress', function (evt) {
                    if (evt.lengthComputable) {
                        if (progress) {
                            progress(evt.loaded / evt.total);
                        }
                    }
                }, false);
                return xhr;
            }
        });
    });
}

request.post = function (url, options) {
    return request('POST', url, options);
};
request.put = function (url, options) {
    return request('PUT', url, options);
};
request.get = function (url, options) {
    return request('GET', url, options);
};
request.del = function (url, options) {
    return request("DELETE", url, options)
};
request.upload = upload;

module.exports = request;
