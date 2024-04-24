import { useContext, useState, useCallback } from "react";
import { StyleSheet, Text, SafeAreaView, View, ScrollView, FlatList } from "react-native";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";
import { AuthContext } from "../store/auth-context";
import { GlobalStyles } from "../constants/styles";
import { fetchPortfolio } from "../util/util";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFormattedDate } from "../util/date";
import { useFocusEffect } from '@react-navigation/native';

const Item = ({ date, price }) => (
	<View style={styles.itemContainer}>
		<Text style={styles.item}>RELIANCE</Text>
		<Text style={styles.item}>{getFormattedDate(date)}</Text>
		<Text style={styles.item}>{price}</Text>
	</View>
);

export default function Portfolio({ navigation }) {
	const [isFetching, setIsFetching] = useState(false);
	const [error, setError] = useState();
	const [portfolioData, setPortfolioData] = useState([]);

	const authCtx = useContext(AuthContext);
	const token = authCtx.token;

	async function getPortfolio() {
		console.log("Fetching portfolio...")
		try {
			setIsFetching(true);
			let email = await AsyncStorage.getItem("email");
			const portfolio = await fetchPortfolio(token, email);

			setPortfolioData(portfolio);
			setIsFetching(false);
		} catch (err) {
			setError("Could not fetch portfolio");
			console.log(err);
		}
	}

	useFocusEffect(
		useCallback(() => {
			getPortfolio();
		}, [])
	);

	// function errorHandler() {
	// 	setError(null);
	// }

	if (error && !isFetching) {
		return <ErrorOverlay message={error} />;
	}

	if (isFetching) {
		return <LoadingOverlay />;
	}

	if (portfolioData.length == 0) {
		return (
			<View style={styles.container}>
				<Text style={styles.heading}>No entry found</Text>
			</View>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<FlatList
				data={portfolioData}
				renderItem={({ item }) => <Item date={item.date} price={item.price} />}
				keyExtractor={(item) => item.id}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingVertical: 8,
		flex: 1,
		backgroundColor: GlobalStyles.colors.primary700,
	},
	heading: {
		color: "white",
		fontSize: 20,
		textAlign: "center",
	},
	itemContainer: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 10,
	},
	item: {
		color: "white",
		fontSize: 16,
	},
});
