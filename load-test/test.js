import http from 'k6/http';
import { check, sleep } from 'k6';

const url = '<API URL>';
const amount = 100;
const version = 'v1';

function generateUser() {
	const id = Math.random() * 100000000;
	return {
		name: `Test-${id}`,
		email: `test-${id}@mail.com`,
		password: '1234'
	};
}

function generateTransaction(number) {
	return {
		description: `${number}`,
		value: Math.ceil(Math.random() * 2000) - 1000
	};
}

export const options = {
	stages: [
		{ target: 1 }
	]
};

export function setup() {
	http.post(`${url}/cleanup`);
}

export default function () {
	const params = {
		headers: {
			'Content-Type': 'application/json',
		},
		tags: { number: '0'}
	};

	const userData = generateUser();

	http.post(
		`${url}/users`, 
		JSON.stringify(userData), 
		params
	);

	let response = http.post(
		`${url}/login`,
		JSON.stringify({
			email: userData.email,
			password: userData.password
		}),
		params
	);

	params.headers.Authorization = `Bearer ${JSON.parse(response.body).token}`;

	let balance = 0;

	const requests = [];

	for(let i = 0; i < amount; i++) {
		const transaction = generateTransaction();

		balance += transaction.value;

		const options = {};
		Object.assign(options, params);
		options.tags = {number: `${i}`};

		requests.push([
			'POST',
			`${url}/${version}/transactions`,
			JSON.stringify(transaction),
			options
		]);

		requests.push([
			'GET',
			`${url}/${version}/balance`,
			null,
			options
		]);
	}

	http.batch(requests);

	sleep(5);

	response = http.get(`${url}/${version}/balance`, params);

	check(response, {
		'Balance is correct': (r) => {
			const data = JSON.parse(r.body);
			return data.balance === balance
		}
	});
}