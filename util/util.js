import axios from "axios";

const FIREBASE_URL = "https://finance-manager-7b1d1-default-rtdb.firebaseio.com";
const BACKEND_URL = "http://localhost:8000";

// Firebase - Expense manager

export async function storeExpense(expenseData, token, email) {
	const response = await axios.post(FIREBASE_URL + "/expenses.json?auth=" + token, {
		...expenseData,
		email: email,
	});
	const id = response.data.name;
	return id;
}

export async function fetchExpenses(token, email) {
	const response = await axios.get(FIREBASE_URL + "/expenses.json?auth=" + token);

	const expenses = [];

	for (const key in response.data) {
		if (response.data[key].email != email) {
			continue;
		}
		const expenseObj = {
			id: key,
			amount: response.data[key].amount,
			date: new Date(response.data[key].date),
			description: response.data[key].description,
		};
		expenses.push(expenseObj);
	}

	return expenses;
}

export function updateExpense(id, expenseData, token, email) {
	return axios.put(FIREBASE_URL + `/expenses/${id}.json?auth=` + token, {
		...expenseData,
		email: email,
	});
}

export function deleteExpense(id, token) {
	return axios.delete(FIREBASE_URL + `/expenses/${id}.json?auth=` + token);
}

// Firebase - Portfolio
export async function storeToPortfolio(price, token, email) {
	const response = await axios.post(FIREBASE_URL + "/portfolio.json?auth=" + token, {
		price: price,
		email: email,
		date: new Date(),
	});
	const id = response.data.name;
	return id;
}

export async function fetchPortfolio(token, email) {
	const response = await axios.get(FIREBASE_URL + "/portfolio.json?auth=" + token);

	const portfolio = [];

	for (const key in response.data) {
		if (response.data[key].email != email) {
			continue;
		}
		const portfolioObj = {
			id: key,
			price: response.data[key].price,
			date: new Date(response.data[key].date),
		};
		portfolio.push(portfolioObj);
	}

	return portfolio;
}

// Flask server - stock data

export async function fetchStockData() {
	const response = await axios.post(BACKEND_URL + "/api/data");
	if (response.data) {
		return response.data;
	}
	return response;
}

export async function fetchMACD() {
	const response = await axios.post(BACKEND_URL + "/api/macd");
	if (response.data.macd) {
		return response.data.macd;
	}
	return response;
}

export async function fetchBB() {
	const response = await axios.post(BACKEND_URL + "/api/bb");
	if (response.data) {
		let bb = JSON.parse(response.data.replace(/\bNaN\b/g, "null"));
		return bb;
	}
	return response;
}

export async function getChatbotResponse(prompt) {
	const response = await axios.post(BACKEND_URL + "/api/chat", {
		prompt: prompt
	});
	if (response.data) {
		return response.data;
	}
	return response;
}
