import { useContext, useEffect, useState } from "react";
import { ExpensesContext } from "../store/expenses-context";
import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { getDateMinusDays } from "../util/date";
import { fetchExpenses } from "../util/util";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";
import { AuthContext } from "../store/auth-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RecentExpenses() {
	const [isFetching, setIsFetching] = useState(true);
	const [error, setError] = useState();

	const expensesCtx = useContext(ExpensesContext);

	const authCtx = useContext(AuthContext);
	const token = authCtx.token;

	useEffect(() => {
		async function getExpenses() {
			setIsFetching(true);
			const email = await AsyncStorage.getItem("email");
			try {
				const expenses = await fetchExpenses(token, email);
				expensesCtx.setExpenses(expenses);
			} catch (err) {
				setError("Could not fetch expenses!");
			}
			setIsFetching(false);
		}

		getExpenses();
	}, [token]);

	// function errorHandler() {
	// 	setError(null);
	// }

	if (error && !isFetching) {
		return <ErrorOverlay message={error} />;
	}

	if (isFetching) {
		return <LoadingOverlay />;
	}

	const RecentExpensesList = expensesCtx.expenses.filter((expense) => {
		const today = new Date();
		const date7DaysAgo = getDateMinusDays(today, 7);

		return expense.date >= date7DaysAgo && expense.date <= today;
	});

	return (
		<ExpensesOutput
			expenses={RecentExpensesList}
			expensesPeriod="Last 7 Days"
			fallbackText={"No expenses registered for the last 7 days."}
		/>
	);
}
