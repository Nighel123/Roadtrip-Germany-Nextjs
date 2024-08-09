// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.

import {
  ChangeEvent,
  FocusEvent,
  MouseEvent,
  MutableRefObject,
  useRef,
  useState,
} from "react";

// However, these types are generated automatically if you're using an ORM such as Prisma.

// Lets you work with Sets easyly. Rememver that this is only working because of the the field "typeRoots": ["./types"] in the tsconfig.json,
// that points to a file that implements the methods not yet implemented by typescript.
export const S = (...v: string[]) => {
  return new Set<string>(v);
};

export type handleBlurType = (
  e: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => void;
export type handleChangeType = (
  e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => void;
export type handleChangeFileType = (e: ChangeEvent<HTMLInputElement>) => void;
export type handleClickType = (e: MouseEvent<HTMLInputElement>) => void;

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  birthday: string;
  sex: "männlich" | "weiblich";
  emailVerified: Date | null;
};

export type Roadtrip = {
  id: string;
  user_id: string;
  start: string;
  dest: string;
  date: string;
  description: string;
  image_url: string;
};

export type RoadtripDisplay = {
  id: string;
  date: string;
  description: string;
  destland: string;
  desttown: string;
  image_url: string;
  username: string;
  user_id: number;
  startland: string;
  starttown: string;
  start_id: string;
  dest_id: string;
  sex: "männlich" | "weiblich";
};

export type MessagesDisplay = {
  id: string;
  text: string;
  created: string;
  from: number;
  to: number;
  read: Date | null;
  roadtripCreatorId: number;
  roadtripId: string;
  roadtripImageURL: string;
  roadtripDate: string;
  destLand: string;
  destTown: string;
  startLand: string;
  startTown: string;
  otherUserName: string;
  otherUserId: number;
};

export const months = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
] as const;
export const sex = ["männlich", "weiblich"] as const;
export type Month = (typeof months)[number];
export type Sex = (typeof sex)[number];

export type LoginForm<T> = {
  username: T;
  password: T;
};

export type DeleteRoadtripForm<T> = {
  roadtripId: T;
};

export type RegisterForm<T> = {
  username: T;
  email: T;
  password: T;
  day: T;
  month: Month;
  year: T;
  sex: Sex;
};

export type RoadtripForm<T> = {
  startland: T;
  starttown: T;
  destland: T;
  desttown: T;
  day: T;
  month: Month;
  year: T;
  description: T;
  file: T;
};

export type RoadtripEditForm<T> = RoadtripForm<T> & {
  roadtripId: T;
};

export type Address = {
  id: string;
  land: string;
  town: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: "pending" | "paid";
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type InitialFormState = {
  message: string;
  errors: { [key: string]: string };
} | null;

export type CustomerField = {
  id: string;
  name: string;
};
