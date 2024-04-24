import { LineChart } from "react-native-chart-kit";
import { Text, View, Dimensions } from "react-native";
import { GlobalStyles } from "../../constants/styles";

export default function CustomLineChart(chartData) {
	return (
		<View>
			<LineChart
				data={{
					datasets: chartData.data,
				}}
				width={Dimensions.get("window").width} // from react-native
				height={220}
				// yAxisLabel="$"
				// yAxisSuffix="k"
				yAxisInterval={1} // optional, defaults to 1
				chartConfig={{
					backgroundColor: GlobalStyles.colors.primary400,
					backgroundGradientFrom: GlobalStyles.colors.primary400,
					backgroundGradientTo: GlobalStyles.colors.primary700,
					decimalPlaces: 2, // optional, defaults to 2dp
					color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
					labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
					style: {
						borderRadius: 16,
					},
					propsForDots: {
						r: "2",
						strokeWidth: "1",
						stroke: GlobalStyles.colors.primary50,
					},
				}}
				bezier
				style={{
					margin: 8,
					borderRadius: 16,
				}}
			/>
		</View>
	);
}
