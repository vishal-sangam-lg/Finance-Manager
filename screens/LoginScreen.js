import { useContext, useState } from "react";
import AuthContent from "../components/Auth/AuthContent";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import { login } from "../util/auth";
import { Alert } from "react-native";
import { AuthContext } from "../store/auth-context";

function LoginScreen() {
	const authCtx = useContext(AuthContext);

	const [isAuthenticating, setIsAuthenticating] = useState();

	async function loginHandler({ email, password }) {
		setIsAuthenticating(true);
		try {
			const token = await login(email, password);
			authCtx.authenticate(token);
		} catch (err) {
			Alert.alert("Authentication failed!");
			setIsAuthenticating(false);
		}
	}

	if (isAuthenticating) {
		return <LoadingOverlay />;
	}

	return <AuthContent isLogin onAuthenticate={loginHandler} />;
}

export default LoginScreen;
