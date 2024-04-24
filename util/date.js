export function getFormattedDate(date) {
	return date.toISOString().slice(0, 10); // YYYY-MM-DD
	// return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`; // DD-MM-YYYY
}

export function getTodayFormattedDate() {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, '0');
	const day = String(today.getDate()).padStart(2, '0');
	const formattedDate = `${year}-${month}-${day}`;
	return formattedDate;
}

export function getDateMinusDays(date, days) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate() - days);
}
