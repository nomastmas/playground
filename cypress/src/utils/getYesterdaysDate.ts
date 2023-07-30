import { DateObjType } from "../types/AppTypes";

/**
 * Returns yesterday's date, month index, year, and full Date value
 *
 * @returns A DateObjType of yesterday's date values
 */
const getYesterdaysDate = (): DateObjType => {
  const dateOffsetOfOneDay = (24*60*60*1000) * 1;
  const date: Date = new Date();
  date.setTime(date.getTime() - dateOffsetOfOneDay);

  return {
    date: date.getDate(),
    month: date.getMonth(),
    year: date.getFullYear(),
    fullDate: date,
  }
}

export default getYesterdaysDate;