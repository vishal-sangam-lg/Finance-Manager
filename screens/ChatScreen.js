import {
	StyleSheet,
	Text,
	SafeAreaView,
	View,
	FlatList,
	TextInput,
	TouchableOpacity,
	ScrollView
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import { GlobalStyles } from "../constants/styles";
import { getChatbotResponse } from "../util/util";


export default function ChatScreen() {
	const [message, setMessage] = useState([]);
	const [outputValue, setOutputValue] = useState("");
	const [inputText, setInputText] = useState("");

	const handleSend = async () => {
		setMessage([inputText]);
		setMessage([inputText]);
		setInputText("");
		const response = await getChatbotResponse(inputText);
		if(response.bot_response != null) {
			setOutputValue(response?.bot_response)
		} else {
			setOutputValue("Something went wrong, could'nt get response")
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<FlatList
				data={message}
				renderItem={({ item }) => <Text style={styles.message}>Q. {item}</Text>}
				keyExtractor={(item) => item}
				style={styles.messageList}
			/>
			<ScrollView style={styles.outputContainer}>
				<Text style={styles.outputText}>{outputValue}</Text>
			</ScrollView>
			<View style={styles.inputContainer}>
				<TextInput
					style={styles.input}
					placeholder="Type your message here..."
					placeholderTextColor="#ffffff"
					value={inputText}
					onChangeText={setInputText}
					selectionColor="transparent"
				/>
				<TouchableOpacity style={styles.sendButton} onPress={handleSend}>
					<Ionicons name="send" size={24} color="#ffffff" />
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: GlobalStyles.colors.primary700,
	},
	messageList: {
		flex: 1,
		maxHeight: 80
	},
	message: {
		color: GlobalStyles.colors.primary50,
		padding: 20,
	},
	inputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'transparent',
		paddingVertical: 8,
		paddingHorizontal: 16,
	},
	input: {
		flex: 1,
		color: GlobalStyles.colors.primary50,
		backgroundColor: GlobalStyles.colors.primary400,
		borderRadius: 20,
		paddingVertical: 8,
		paddingHorizontal: 16,
		marginRight: 8,
	},
	sendButton: {
		backgroundColor: 'transparent',
		borderRadius: 20,
		padding: 8,
	},
	outputContainer: {
		flex: 1,
		backgroundColor: GlobalStyles.colors.primary400,
		margin: 20,
		borderRadius: 20,
		padding: 16,
	},
	outputText: {
		color: GlobalStyles.colors.primary50,
		fontSize: 16,
		padding: 8,
	},
});
