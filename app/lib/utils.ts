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

/* export const generateYAxis = (revenue: Revenue[]) => {
  // Calculate what labels we need to display on the y-axis
  // based on highest record and in 1000s
  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((month) => month.revenue));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`$${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
}; */

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};
