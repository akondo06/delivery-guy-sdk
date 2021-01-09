import axios from 'axios';

export default class Service {
	constructor({ baseUrl, token } = {}) {
		this.token = token;
		this._instance = axios.create({
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
		const result = {
			'X-Token': this.token
		};

		if(this.userToken) {
			result['Authorization'] = this.userToken;
		}

		return result;
	}

	_method(endpoint) {
		let result = 'post';

		const segments = this._segments(endpoint);

		const last = segments[segments.length - 1];

		if(last === 'get') {
			result = 'get';
		}
		if(last === 'create') {
			result = 'put';
		}
		if(last === 'update') {
			result = 'patch';
		}
		if(last === 'delete' || last === 'sign_out') {
			result = 'delete';
		}

		return result;
	}

	_url(endpoint, payload) {
		const segments = this._segments(endpoint);
		const last = segments.length > 1 ? segments.pop() : segments[0];

		if(['get', 'update', 'delete'].includes(last) && payload && payload.id) {
			segments.push(payload.id + '');
		}
		return segments.join('/');
	}

	async request(endpoint, payload) {
		try {
			const method = this._method(endpoint);

			const response = await this._instance({
				url: this._url(endpoint, payload),
				method,
				headers: this._headers(),
				data: method === 'get' ? undefined : payload,
				responseType: 'json',
				responseEncoding: 'utf8'
			});

			return response && response.data;
		} catch(error) {
			throw error;
		}
	}
}
