import { useEffect, useState } from "react";
import { CandlestickChart } from "react-native-wagmi-charts";
import { StyleSheet, Text, View } from "react-native";

export default function CustomCandlestickChart(candlestickData) {
	const [data, setData] = useState([]);
	useEffect(() => {
		try {
			let candlesticks = [];
			for (let i = 0; i < candlestickData?.data.length; i++) {
				let candlestick = {
					open: Number(parseFloat(candlestickData.data[i].open).toFixed(2)),
					high: Number(parseFloat(candlestickData.data[i].high).toFixed(2)),
					low: Number(parseFloat(candlestickData.data[i].low).toFixed(2)),
					close: Number(parseFloat(candlestickData.data[i].close).toFixed(2)),
				};
				candlesticks.push(candlestick);
			}
			setData(candlesticks);
		} catch (err) {
			console.log(err);
		}
	}, [candlestickData]);

	return (
		<CandlestickChart.Provider data={data}>
			<CandlestickChart height={200}>
				<CandlestickChart.Candles positiveColor="white" negativeColor="white" />
				<CandlestickChart.Crosshair />
			</CandlestickChart>
			<View style={styles.detailContainer}>
				<Text style={styles.white}>Open: </Text>
				<CandlestickChart.PriceText type="open" style={styles.white} />
				<Text style={styles.white}>High: </Text>
				<CandlestickChart.PriceText type="high" style={styles.white} />
			</View>
			<View style={styles.detailContainer}>
				<Text style={styles.white}>Low: </Text>
				<CandlestickChart.PriceText type="low" style={styles.white} />
				<Text style={styles.white}>Close: </Text>
				<CandlestickChart.PriceText type="close" style={styles.white} />
			</View>
		</CandlestickChart.Provider>
	);
}

const styles = StyleSheet.create({
	detailContainer: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-around",
	},
	white: {
		color: "white",
		textAlign: "center",
	},
});
