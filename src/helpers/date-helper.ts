export class DateHelper {
  static isToday(dateStr: string): boolean {
    const [day, month, year] = dateStr.split(".").map(Number);

    // Create input date in Kyrgyzstan timezone (UTC+6)
    const inputDate = new Date(year, month - 1, day);
    
    // Get current date in Kyrgyzstan timezone (UTC+6)
    const now = new Date();
    const kyrgyzstanTime = new Date(now.getTime() + (6 * 60 * 60 * 1000)); // Add 6 hours
    
    // Compare dates in the same timezone
    return (
      inputDate.getFullYear() === kyrgyzstanTime.getUTCFullYear() &&
      inputDate.getMonth() === kyrgyzstanTime.getUTCMonth() &&
      inputDate.getDate() === kyrgyzstanTime.getUTCDate()
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
