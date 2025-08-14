export class DateHelper {
    static isToday(dateStr: string): boolean {
        const [day, month, year] = dateStr.split('.').map(Number);

        const inputDate = new Date(year, month - 1, day);
        const today = new Date();

        return (
            inputDate.getFullYear() === today.getFullYear() &&
            inputDate.getMonth() === today.getMonth() &&
            inputDate.getDate() === today.getDate()
        );
    }

}