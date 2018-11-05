'use strict';

var Odoo = function (config) {
    config = config || {};

    this.host = config.host;
    this.port = config.port || 80;
    this.database = config.database;
    this.username = config.username;
    this.password = config.password;
};
Odoo.prototype.connect = function (callback) {
    var params = {
        db: this.database,
        login: this.username,
        password: this.password
    };

    var json = JSON.stringify({params: params});
    var url = 'http://' + this.host + ':' + this.port + '/web/session/authenticate';

    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Content-Length': json.length
        },
        body: json
    };
    fetch(url, options)
        .then(res => {
            this.sid = res.headers.map['set-cookie'][0].split(';')[0];
            console.log('sid:', this.sid);
            return res.json()
        })
        .then(data => {
            console.log(data);
            if (data.error) {
                callback(data.error, null);
            } else {
                this.uid = data.result.uid;
                this.session_id = data.result.session_id;
                this.context = data.result.user_context;
                this.username = data.result.username;
                callback(null, data.result);
            }
        }, err => {
            callback(err, null);
        });

};

Odoo.prototype.call = function (model, method, params, callback) {
    this._request('/web/dataset/call_kw', {
        model: model,
        method: method,
        args: [
            params
        ],
        kwargs: {
        },
    }, callback);
};

Odoo.prototype._request = function (path, params, callback) {
    params = params || {};

    var url = 'http://' + this.host + ':' + this.port + (path || '/') + '';
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cookie': 'session_id=' + this.session_id + ';'
        },
        body: JSON.stringify({jsonrpc: '2.0', id: new Date().getUTCMilliseconds(), method: 'call', params: params})
    };

    fetch(url, options)
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                callback(data.error, null);
            } else {
                callback(null, data.result);
            }
        }, err => {
            callback(err, null);
        });
};

module.exports = Odoo;
