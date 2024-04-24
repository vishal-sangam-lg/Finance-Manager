import { useContext, useLayoutEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import IconButton from "../components/UI/IconButton";
import { GlobalStyles } from "../constants/styles";
import Button from "../components/UI/Button";
import { ExpensesContext } from "../store/expenses-context";
import ExpenseForm from "../components/ManageExpense/ExpenseForm";
import { deleteExpense, storeExpense, updateExpense } from "../util/util";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";
import { AuthContext } from "../store/auth-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ManageExpense({ route, navigation }) {
	const authCtx = useContext(AuthContext);
	const token = authCtx.token;

	const [error, setError] = useState();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const expensesCtx = useContext(ExpensesContext);

	const editedExpenseId = route.params?.expenseId;
	const isEditing = !!editedExpenseId;

	const selectedExpense = expensesCtx.expenses.find((expense) => expense.id === editedExpenseId);

	useLayoutEffect(() => {
		navigation.setOptions({
			title: isEditing ? "Edit Expense" : "Add Expense",
		});
	}, [navigation, isEditing]);

	async function deleteExpenseHandler() {
		setIsSubmitting(true);
		try {
			await deleteExpense(editedExpenseId, token);
			expensesCtx.deleteExpense(editedExpenseId);
			navigation.goBack();
		} catch (err) {
			setError("Could not delete");
			setIsSubmitting(false);
		}
	}

	function cancelHandler() {
		navigation.goBack();
	}

	async function confirmHandler(expenseData) {
		setIsSubmitting(true);
		try {
			if (isEditing) {
				const email = await AsyncStorage.getItem("email");
				expensesCtx.updateExpense(editedExpenseId, expenseData);
				await updateExpense(editedExpenseId, expenseData, token, email);
			} else {
				const email = await AsyncStorage.getItem("email");
				const id = await storeExpense(expenseData, token, email);
				expensesCtx.addExpense({ ...expenseData, id: id });
			}
			navigation.goBack();
		} catch (err) {
			setError("Could not save data");
			setIsSubmitting(false);
		}
	}

	// function errorHandler() {
	// 	setError(null);
	// }

	if (error && !isSubmitting) {
		return <ErrorOverlay message={error} />;
	}

	if (isSubmitting) {
		return <LoadingOverlay />;
	}

	return (
		<View style={styles.container}>
			<ExpenseForm
				submitButtonLabel={isEditing ? "Update" : "Add"}
				onSubmit={confirmHandler}
				onCancel={cancelHandler}
				defaultValues={selectedExpense}
			/>
			{isEditing && (
				<View style={styles.deleteContainer}>
					<IconButton
						icon="trash"
						color={GlobalStyles.colors.error500}
						size={36}
						onPress={deleteExpenseHandler}
					/>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 24,
		backgroundColor: GlobalStyles.colors.primary800,
	},
	deleteContainer: {
		marginTop: 16,
		paddingTop: 8,
		borderTopWidth: 2,
		borderTopColor: GlobalStyles.colors.primary200,
		alignItems: "center",
	},
});
