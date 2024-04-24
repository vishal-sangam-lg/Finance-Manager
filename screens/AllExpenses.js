import { useContext } from "react";
import { ExpensesContext } from "../store/expenses-context";
import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";

export default function AllExpenses() {
	const expensesCtx = useContext(ExpensesContext);
	return (
		<ExpensesOutput
			expenses={expensesCtx.expenses}
			expensesPeriod="Total"
			fallbackText={"No expenses found."}
		/>
	);
}
