import { useState } from "react";
import { Alert, Image, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import FlatButton from "../UI/FlatButton";
import AuthForm from "./AuthForm";
import { GlobalStyles } from "../../constants/styles";
import { Ionicons } from '@expo/vector-icons';

function AuthContent({ isLogin, onAuthenticate }) {
	const navigation = useNavigation();

	const [credentialsInvalid, setCredentialsInvalid] = useState({
		email: false,
		password: false,
		confirmPassword: false,
	});

	function switchAuthModeHandler() {
		if (isLogin) {
			navigation.replace("Signup");
		} else {
			navigation.replace("Login");
		}
	}

	function submitHandler(credentials) {
		let { email, password, confirmPassword } = credentials;

		email = email.trim();
		password = password.trim();

		const emailIsValid = email.includes("@");
		const passwordIsValid = password.length > 6;
		const passwordsAreEqual = password === confirmPassword;

		if (!emailIsValid || !passwordIsValid || (!isLogin && !passwordsAreEqual)) {
			Alert.alert("Invalid input", "Please check your entered credentials.");
			setCredentialsInvalid({
				email: !emailIsValid,
				password: !passwordIsValid,
				confirmPassword: !passwordIsValid || !passwordsAreEqual,
			});
			return;
		}
		onAuthenticate({ email, password });
	}

	return (
		<View style={styles.authContent}>
			<View style={styles.logoContainer}>
				<View style={styles.brand}>Finance Manager</View>
				<Ionicons name="analytics" size={50} color={GlobalStyles.colors.primary100}  />
			</View>
			<AuthForm
				isLogin={isLogin}
				onSubmit={submitHandler}
				credentialsInvalid={credentialsInvalid}
			/>
			<View style={styles.buttons}>
				<FlatButton onPress={switchAuthModeHandler}>
					{isLogin ? "Create a new user" : "Log in instead"}
				</FlatButton>
			</View>
		</View>
	);
}

export default AuthContent;

const styles = StyleSheet.create({
	authContent: {
		marginTop: 64,
		marginHorizontal: 32,
		padding: 16,
		borderRadius: 8,
		backgroundColor: GlobalStyles.colors.primary800,
		elevation: 2,
		shadowColor: "black",
		shadowOffset: { width: 1, height: 1 },
		shadowOpacity: 0.35,
		shadowRadius: 4,
	},
	buttons: {
		marginTop: 8,
	},
	logoContainer: {
		flex: 1,
		justifyContent: "space-around",
		alignItems: "center",
		padding: 10,
		flexDirection: "row",
	},
	brand: {
		color: GlobalStyles.colors.primary100,
		fontSize: 20,
		fontFamily: "monospace"
	}
});
