import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import Stocks from "./screens/Stocks";
import Portfolio from "./screens/Portfolio";
import ManageExpense from "./screens/ManageExpense";
import RecentExpenses from "./screens/RecentExpenses";
import AllExpenses from "./screens/AllExpenses";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import { GlobalStyles } from "./constants/styles";
import IconButton from "./components/UI/IconButton";
import ExpensesContextProvider from "./store/expenses-context";
import AuthContextProvider, { AuthContext } from "./store/auth-context";
import { useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import Icon from "react-native-vector-icons/Foundation";
import { storeToPortfolio } from "./util/util";
import ChatScreen from "./screens/ChatScreen";

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();

async function addToPortfolio(token) {
	let price = await AsyncStorage.getItem("price");
	let email = await AsyncStorage.getItem("email");
	let result = storeToPortfolio(price, token, email);
}

function AuthStack() {
	return (
		<Stack.Navigator
			screenOptions={{
				headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
				headerTintColor: "white",
				contentStyle: { backgroundColor: GlobalStyles.colors.primary100 },
			}}
		>
			<Stack.Screen name="Login" component={LoginScreen} />
			<Stack.Screen name="Signup" component={SignupScreen} />
		</Stack.Navigator>
	);
}

function ExpensesOverview() {
	const authCtx = useContext(AuthContext);

	return (
		<BottomTabs.Navigator
			screenOptions={({ navigation }) => ({
				headerTitleAlign: "center",
				headerStyle: {
					backgroundColor: GlobalStyles.colors.primary500,
				},
				headerTintColor: "white",
				tabBarStyle: {
					backgroundColor: GlobalStyles.colors.primary500,
				},
				tabBarActiveTintColor: GlobalStyles.colors.accent500,
				headerRight: ({ tintColor }) => (
					<IconButton
						icon="add"
						size={24}
						color={tintColor}
						onPress={() => {
							navigation.navigate("ManageExpense");
						}}
					/>
				),
			})}
		>
			<BottomTabs.Screen
				name="Stocks"
				component={Stocks}
				options={{
					title: "Stocks",
					tabBarLabel: "Stocks",
					tabBarIcon: ({ color, size }) => (
						<Icon name="graph-trend" size={size} color={color} />
					),
					headerRight: ({ tintColor }) => (
						<IconButton
							icon="add"
							color={tintColor}
							size={24}
							onPress={() => {
								addToPortfolio(authCtx.token);
							}}
						/>
					),
				}}
			/>
			<BottomTabs.Screen
				name="Portfolio"
				component={Portfolio}
				options={{
					title: "Portfolio",
					tabBarLabel: "Portfolio",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="ios-list-outline" size={size} color={color} />
					),
					headerRight: ({ tintColor }) => (
						// <IconButton
						// 	icon="add"
						// 	color={tintColor}
						// 	size={24}
						// 	onPress={() => {
						// 		console.log("add to portfolio");
						// 	}}
						// />
						<></>
					),
				}}
			/>
			<BottomTabs.Screen
				name="RecentExpenses"
				component={RecentExpenses}
				options={{
					title: "Recent Expenses",
					tabBarLabel: "Recent",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="hourglass" size={size} color={color} />
					),
				}}
			/>
			<BottomTabs.Screen
				name="AllExpenses"
				component={AllExpenses}
				options={{
					title: "All Expenses",
					tabBarLabel: "All Expenses",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="calendar" size={size} color={color} />
					),
					headerRight: ({ tintColor }) => (
						<IconButton
							icon="exit"
							color={tintColor}
							size={24}
							onPress={authCtx.logout}
						/>
					),
				}}
			/>
			<BottomTabs.Screen
				name="ChatScreen"
				component={ChatScreen}
				options={{
					title: "Chat Bot",
					tabBarLabel: "Chat Bot",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="chatbox" size={size} color={color} />
					),
					headerRight: ({ tintColor }) => (
						<IconButton
							icon="exit"
							color={tintColor}
							size={24}
							onPress={authCtx.logout}
						/>
					),
				}}
			/>
		</BottomTabs.Navigator>
	);
}

function AuthenticatedStack() {
	return (
		<Stack.Navigator
			initialRouteName="ExpenseOverview"
			screenOptions={{
				headerStyle: {
					backgroundColor: GlobalStyles.colors.primary500,
				},
				headerTintColor: "white",
			}}
		>
			<Stack.Screen
				name="ExpensesOverview"
				component={ExpensesOverview}
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="ManageExpense"
				component={ManageExpense}
				options={{
					presentation: "modal",
					title: "Manage Expense",
				}}
			/>
		</Stack.Navigator>
	);
}

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function Navigation() {
	const [appIsReady, setAppIsReady] = useState(false);
	const authCtx = useContext(AuthContext);

	useEffect(() => {
		async function fetchToken() {
			const storedToken = await AsyncStorage.getItem("token");

			if (storedToken) {
				authCtx.authenticate(storedToken);
			}

			setAppIsReady(true);
			// Hide the splash screen
			await SplashScreen.hideAsync();
		}
		fetchToken();
	}, []);

	if (!appIsReady) {
		return null;
	}

	return (
		<NavigationContainer>
			{!authCtx.isAuthenticated && <AuthStack />}
			{authCtx.isAuthenticated && (
				<ExpensesContextProvider>
					<AuthenticatedStack />
				</ExpensesContextProvider>
			)}
		</NavigationContainer>
	);
}

export default function App() {
	return (
		<>
			<StatusBar style="light" />
			<AuthContextProvider>
				<Navigation />
			</AuthContextProvider>
		</>
	);
}
