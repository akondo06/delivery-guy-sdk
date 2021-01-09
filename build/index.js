"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _axios = _interopRequireDefault(require("axios"));

class Service {
  constructor() {
    var {
      baseUrl,
      token
    } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    this.token = token;
    this._instance = _axios.default.create({
      baseURL: baseUrl || 'https://api.akondo.dev'
    });
  }

  setUserToken(token) {
    this.userToken = token;
  }

  _segments(endpoint) {
    return (endpoint || '').toLowerCase().split('.');
  }

  _headers() {
    var result = {
      'X-Token': this.token
    };

    if (this.userToken) {
      result['Authorization'] = this.userToken;
    }

    return result;
  }

  _method(endpoint) {
    var result = 'post';

    var segments = this._segments(endpoint);

    var last = segments[segments.length - 1];

    if (last === 'get') {
      result = 'get';
    }

    if (last === 'create') {
      result = 'put';
    }

    if (last === 'update') {
      result = 'patch';
    }

    if (last === 'delete' || last === 'sign_out') {
      result = 'delete';
    }

    return result;
  }

  _url(endpoint, payload) {
    var segments = this._segments(endpoint);

    var last = segments.length > 1 ? segments.pop() : segments[0];

    if (['get', 'update', 'delete'].includes(last) && payload && payload.id) {
      segments.push(payload.id + '');
    }

    return segments.join('/');
  }

  request(endpoint, payload) {
    var _this = this;

    return (0, _asyncToGenerator2.default)(function* () {
      try {
        var method = _this._method(endpoint);

        var response = yield _this._instance({
          url: _this._url(endpoint, payload),
          method,
          headers: _this._headers(),
          data: method === 'get' ? undefined : payload,
          responseType: 'json',
          responseEncoding: 'utf8'
        });
        return response && response.data;
      } catch (error) {
        throw error;
      }
    })();
  }

}

exports.default = Service;