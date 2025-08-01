export function formatDateForInput(date: string | null): string | null {
    if (!date) return null; // Return null if the input is empty
    const d = new Date(date);
    if (isNaN(d.getTime())) return null; // Return null if the date is invalid

    // Format the date in local timezone
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(d.getDate()).padStart(2, '0'); // Get day in local time

    return `${year}-${month}-${day}`;
}