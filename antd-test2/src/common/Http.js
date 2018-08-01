import lodash from 'lodash';
import fetch from 'isomorphic-fetch';

export class Http {
    _config = {
        csrf: {
            api: '/csrf/getCsrfToken',
            timeout: 11 * 60 * 10000,
            getToken: response => response.token,
        },
        errorHook: error => {
            throw error;
        },
    };

    csrf = null;

    checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
            return response;
        }

        console.error(response);
    }

    mode = 'remote'; //local本地调试模式，remote远程模式，product生产模式

    getUrl(url) {
        let prefix = '';
        let suffix = '';
        switch (this.mode) {
            case 'local': {
                prefix = 'mock/';
                // suffix = '.json';
                require('../mock/apiData')
                break;
            }
            case 'remote': {
                prefix = '';
                break;
            }
            case 'product': {
                prefix = '';
                break;
            }
            default: {
                prefix = '';
                break;
            }
        }
        let _url = prefix + url + suffix;
        return _url;
    }

    async parseJSON(response) {
        return new Promise(function func(resolve, reject) {
            if (!response) {
                return resolve({
                    head: {
                        "resultCode": "-1",
                        "remark": "请求出错"
                    },
                    data: {}
                });
            }

            response.text().then(text => {
                let result = null;
                try {
                    result = JSON.parse(text);
                }
                catch (e) {
                    console.error('解析json字符串报错： ' + text);
                    console.error(e);
                }

                return resolve(result);
            });
        });
    }

    async processResult(response) {
        let _response = this.checkStatus(response);
        _response = this.parseJSON(_response);
        return _response;
    }

    async _request(url, init, headers = {}, config = {
        throwError: false
    }) {
        try {
            let options = lodash.assign({
                    credentials: 'include'
                },
                init
            );
            options.headers = Object.assign({
                    'x-requested-with': 'XMLHttpRequest',
                    'Access-Control-Allow-Origin': '*'
                },
                options.headers || {},
                headers || {}
            );
            // if (url.indexOf('/mock') === 0) {
            //     // get json是不能有body信息的
            //     options = null;
            // }
            let response = await fetch(url, options);
debugger;
            response = await this.processResult(response);
            return response;
        } catch (error) {
            this.log(error);
            this._config.errorHook(error);
            if (config.throwError) throw error;
            return null;
        }
    }

    /**
     * headers
     * csrf
     * host
     * cqrs
     **/
    set config(config) {
        this._config = {
            ...this._config,
            ...config,
        };
    }

    token = null;

    async getCsrfToken() {
        if (!this.token) {
            let response = await this.get(this._config.csrf.api);
            if (this._config.csrf.getToken) {
                response = this._config.csrf.getToken(response);
            }
            if (!response) {
                throw new Error('CSRF Not EXIST!');
            }
            this.token = response;
            setTimeout(() => {
                this.token = undefined;
            }, this._config.csrf.timeout || 11 * 60 * 1000);
        }
        return this.token;
    }

    async get(api, data = {}, headers = {}, config = {}) {
        api = this.getUrl(api);
        const query = lodash.isEmpty(data) ?
            '' :
            `json=${encodeURIComponent(JSON.stringify(data))}`;
        return await this._request(`${api}?${query}`, headers, {}, config);
    }

    async post(api, data = {}, headers = {}, config = {}) {
        api = this.getUrl(api);
        /**
         const token = await this.getCsrfToken();
         const _headers = {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': token.token,
      ...headers,
    };
         **/
        const _headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...headers,
        };

        let dataWrapper = {
            head: {
                reqTime: this.getCurrentDateTime() //请求时间：yyyymmdd HH24:mi:ss，必填
            },
            data: data
        }

        const formBody = JSON.stringify(dataWrapper);

        //this.log(api + '请求参数是：' + formBody);

        return await this._request(
            api, {
                method: 'POST',
                headers: _headers,
                body: formBody,
            }, {},
            config
        );
    }

    log(msg) {
        if (this.mode !== 'product') {
            console.log(msg);
        }
    }

    getCurrentDateTime() {
        let now = new Date();
        let year = now.getFullYear(); // 年
        let month = now.getMonth() + 1; // 月
        let day = now.getDate(); //日
        let hh = now.getHours(); //时
        let mm = now.getMinutes(); //分
        let ss = now.getSeconds(); //秒
        let clock = year + "-";
        if (month < 10)
            clock += "0";
        clock += month + "-";
        if (day < 10)
            clock += "0";
        if (ss < 10)
            ss += "0";
        clock += day;
        clock += " ";
        let time = "" + hh + ":" + mm + ":" + ss;
        clock += time;
        return (clock);
    }
}

const http = new Http();

export default http;
