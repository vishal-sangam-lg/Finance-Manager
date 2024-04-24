import { useContext, useState } from "react";
import AuthContent from "../components/Auth/AuthContent";
import { createUser } from "../util/auth";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import { Alert } from "react-native";
import { AuthContext } from "../store/auth-context";

function SignupScreen() {
	const authCtx = useContext(AuthContext);

	const [isAuthenticating, setIsAuthenticating] = useState();

	async function signupHandler({ email, password }) {
		setIsAuthenticating(true);
		try {
			const token = await createUser(email, password);
			authCtx.authenticate(token);
		} catch (err) {
			Alert.alert("Could not create user, please check your input and try again later.");
			setIsAuthenticating(false);
		}
	}

	if (isAuthenticating) {
		return <LoadingOverlay />;
	}

	return <AuthContent onAuthenticate={signupHandler} />;
}

export default SignupScreen;
