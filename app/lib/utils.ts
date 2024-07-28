import { MutableRefObject } from "react";
import {
  Month,
  RoadtripForm,
  handleBlurType,
  handleChangeType,
  months,
} from "./definitions";

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = "de-DE"
) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

/* intersection of p and u */
export function restrict(p: string[], u: { [key: string]: any }) {
  const o = { ...u };
  for (const prop in o) {
    // For all props in o // Delete if not in p
    if (!p.includes(prop)) delete o[prop];
  }
  return o;
}
/* checks whether a is a subset of b */
export function arrSubset(a: any[], b: any[]) {
  return a.every((e) => b.includes(e));
}

export function arrIntersection(a: any[], b: any[]) {
  //return a.some((e) => b.includes(e));
  return a.filter((value) => b.includes(value));
}

/* delete all properties of u with a falsy value   */
export function deleteEmptyKeys(u: { [key: string]: any }) {
  const o = { ...u };
  for (const key in o) {
    if (!o[key]) delete o[key];
  }
  return o;
}

export const monthToNumber = (month: Month) => months.indexOf(month) + 1;
