import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_KEY = "AIzaSyDDa5m0pl00F7z98f4yLhJaBeICOROIdSQ";

async function authenticate(mode, email, password) {
	const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`;

	const response = await axios.post(url, {
		email: email,
		password: password,
		returnSecureToken: true,
	});

	AsyncStorage.setItem("email", email);
	const token = response.data.idToken;
	return token;
}

export function createUser(email, password) {
	return authenticate("signUp", email, password);
}

export function login(email, password) {
	return authenticate("signInWithPassword", email, password);
}
