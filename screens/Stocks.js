import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, SafeAreaView, View, ScrollView } from "react-native";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";
import { AuthContext } from "../store/auth-context";
import { fetchStockData } from "../util/util";
import { fetchMACD } from "../util/util";
import { fetchBB } from "../util/util";
import CustomCandlestickChart from "../components/Graphs/CustomCandlestickChart";
import CustomLineChart from "../components/Graphs/CustomLineChart";
import { GlobalStyles } from "../constants/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Stocks() {
	const [isFetching, setIsFetching] = useState(true);
	const [error, setError] = useState();
	const [candlestickData, setCandlestickData] = useState([]);
	const [macdData, setMacdData] = useState([]);
	const [BBData, setBBData] = useState([]);
	const [lastPrice, setLastPrice] = useState();

	const authCtx = useContext(AuthContext);
	const token = authCtx.token;

	useEffect(() => {
		async function getStockData() {
			try {
				const stockData = await fetchStockData();
				let candlesticks = [];
				for (let i = 50; i < stockData?.open?.length; i++) {
					let candlestick = {
						open: parseFloat(stockData.open[i]).toFixed(2),
						high: parseFloat(stockData.high[i]).toFixed(2),
						low: parseFloat(stockData.low[i]).toFixed(2),
						close: parseFloat(stockData.close[i]).toFixed(2),
					};
					candlesticks.push(candlestick);
					// Caching last price
					if (i == stockData.open.length - 1) {
						let price = parseFloat(stockData.close[i]).toFixed(2);
						setLastPrice(price);
						AsyncStorage.setItem("price", price);
					}
				}
				// if (candlesticks.length > 0) {
				// 	setIsFetching(false);
				// }
				setCandlestickData(candlesticks);
			} catch (err) {
				console.log(err);
				setError("Could not fetch stock data!");
			}
		}

		async function getMACD() {
			try {
				const data = await fetchMACD();
				let macd = data.macd;
				let signal = data.signal;
				let macdLine = { data: [] };
				let signalLine = { data: [] };
				for (let i = 50; i < macd.length; i++) {
					macdLine.data = [...macdLine.data, macd[i]];
					signalLine.data = [...signalLine.data, signal[i]];
				}
				setMacdData([macdLine, signalLine]);
			} catch (err) {
				console.log(err);
				setError("Could not fetch macd data!");
			}
		}

		async function getBB() {
			try {
				const data = await fetchBB();
				let lowerBand = data.lower_band;
				let upperBand = data.upper_band;
				let closePrices = data.close;
				let lowerBandLine = { data: [] };
				let upperBandLine = { data: [] };
				let closePricesLine = { data: [] };
				for (let i = 50; i < lowerBand.length; i++) {
					lowerBandLine.data = [...lowerBandLine.data, lowerBand[i]];
					upperBandLine.data = [...upperBandLine.data, upperBand[i]];
					closePricesLine.data = [...closePricesLine.data, closePrices[i]];
				}
				setBBData([lowerBandLine, upperBandLine, closePricesLine]);
			} catch (err) {
				setError("Could not fetch bollinger bands data!");
				console.log(err);
			}
		}

		async function getAllData() {
			setIsFetching(true);
			await getStockData();
			await getMACD();
			await getBB();
			setIsFetching(false);
		}

		getAllData();
	}, []);

	// function errorHandler() {
	// 	setError(null);
	// }

	if (error && !isFetching) {
		return <ErrorOverlay message={error} />;
	}

	if (isFetching) {
		return <LoadingOverlay />;
	}

	return (
		<SafeAreaView>
			<ScrollView>
				<View style={styles.container}>
					<Text style={styles.white}>Reliance - {lastPrice}</Text>
					<Text style={{ textAlign: "center", color: GlobalStyles.colors.accent500 }}>
						Candlestick
					</Text>
					<CustomCandlestickChart data={candlestickData} />
					<Text style={{ textAlign: "center", color: GlobalStyles.colors.accent500 }}>
						MACD
					</Text>
					<CustomLineChart data={macdData} />
					<Text style={{ textAlign: "center", color: GlobalStyles.colors.accent500 }}>
						Bollinger Bands
					</Text>
					<CustomLineChart data={BBData} />
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingVertical: 8,
		flex: 1,
		backgroundColor: GlobalStyles.colors.primary700,
	},
	white: {
		color: "white",
		textAlign: "center",
	},
});
