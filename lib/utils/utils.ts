import { MutableRefObject } from "react";
import {
  MessagesDisplay,
  Month,
  RoadtripForm,
  handleBlurType,
  handleChangeType,
  months,
} from "../definitions";

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

export function nestMessageArrayByOtherUserId(
  messages: MessagesDisplay[]
): MessagesDisplay[][] {
  if (messages.length === 0) return [];
  let nestedArray: MessagesDisplay[][] = [];
  let roadtripId = messages[0].roadtripId;
  let otherUserId = messages[0].otherUserId;
  let rest = messages;
  let partRoadID: MessagesDisplay[];
  let partOtherUserID: MessagesDisplay[];
  while (rest.length > 0) {
    let pivot = rest.findIndex((el) => {
      return el.roadtripId !== roadtripId;
    });
    if (pivot == -1) {
      partRoadID = rest;
      rest = [];
    } else {
      partRoadID = rest.slice(0, pivot);
      roadtripId = rest[pivot].roadtripId;
      rest = rest.slice(pivot);
    }
    while (partRoadID.length > 0) {
      let pivot = partRoadID.findIndex((el) => {
        return el.otherUserId !== otherUserId;
      });
      if (pivot == -1) {
        partOtherUserID = partRoadID;
        partRoadID = [];
      } else {
        partOtherUserID = partRoadID.slice(0, pivot);
        otherUserId = partRoadID[pivot].otherUserId;
        partRoadID = partRoadID.slice(pivot);
      }
      if (partOtherUserID.length !== 0)
        nestedArray.push(sortMessages(partOtherUserID));
    }
  }
  return nestedArray;
}

export function sortNestedMessages(nestedMessages: MessagesDisplay[][]) {
  nestedMessages.map((messages) => sortMessages(messages));
  const compareFn = (a: Date, b: Date) => {
    if (a > b) {
      return -1;
    }
    if (b > a) {
      return 1;
    }
    return 0;
  };

  return nestedMessages.sort((a, b) => {
    return compareFn(new Date(a[0].created), new Date(b[0].created));
  });
}

export function getConversationHash(message: MessagesDisplay) {
  const { from, to } = message;
  const end = from < to ? from + to : to + from;
  return message.roadtripId + end;
}

export function getHashArray(messagesOverview: MessagesDisplay[]) {
  return messagesOverview.map((message) => getConversationHash(message));
}

export function displayNestedArray(nestedMessages: MessagesDisplay[][]) {
  return nestedMessages.map((messages) => messages.reverse());
}

export function nestMessagesToOverviewMessages(
  messages: MessagesDisplay[][],
  userID: string
): MessagesDisplay[] {
  if (messages.length === 0) return [];
  let overviewMessages: MessagesDisplay[] = [];
  messages.forEach((messages) => {
    const sortMess = messages;
    const unread = sortMess.some(
      (message) => message.read === null && message.to === Number(userID)
    );
    const pivot = sortMess[0];
    if (unread) {
      pivot.read = null;
    } else {
      pivot.read = new Date();
    }
    const pivotMessage = sortMess[0];

    overviewMessages.push(pivotMessage);
  });
  return overviewMessages;
}

export function sortMessages(messages: MessagesDisplay[]) {
  /* A negative value indicates that a should come before b.
A positive value indicates that a should come after b.
Zero or NaN indicates that a and b are considered equal. */
  if (messages.length === 0) return [];
  const compareFn = (a: Date, b: Date) => {
    if (a > b) {
      return -1;
    }
    if (b > a) {
      return 1;
    }
    return 0;
  };

  return messages.sort((a, b) => {
    return compareFn(new Date(a.created), new Date(b.created));
  });
}

export const monthToNumber = (month: Month) => months.indexOf(month) + 1;
