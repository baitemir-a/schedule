export class DateHelper {
  static isToday(dateStr: string): boolean {
    const [day, month, year] = dateStr.split(".").map(Number);

    const inputDate = new Date(year, month - 1, day);
    const today = new Date();

    return (
      inputDate.getFullYear() === today.getFullYear() &&
      inputDate.getMonth() === today.getMonth() &&
      inputDate.getDate() === today.getDate()
    );
  }

  private static readonly ARRIVAL_TIME = "09:00:00";

  static getArrivalTime(): string {
    const [hour, minute, second] = this.ARRIVAL_TIME.split(":").map(Number);

    let utcHour = hour - 6;

    if (utcHour < 0) {
      utcHour += 24;
    }

    const pad = (n: number) => n.toString().padStart(2, "0");

    return `${pad(utcHour)}:${pad(minute)}:${pad(second)}`;
  }
}
