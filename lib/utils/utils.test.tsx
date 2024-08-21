import { MessagesDisplay } from "../definitions";
import {
  nestMessageArrayByOtherUserId,
  nestMessagesToOverviewMessages,
  sortMessages,
} from "./utils";

const messagesMock = [
  {
    otherUserId: 51,
    roadtripId: "7d2f",
  },
  {
    otherUserId: 51,
    roadtripId: "7d2f",
  },
  {
    otherUserId: 51,
    roadtripId: "7d2f",
  },
  {
    otherUserId: 62,
    roadtripId: "7d2f",
  },
  {
    otherUserId: 62,
    roadtripId: "b8fb",
  },
] as MessagesDisplay[];

const nestedMessagesMock = [
  [
    {
      otherUserId: 62,
      roadtripId: "7d2f",
    },
  ],
  [
    {
      otherUserId: 62,
      roadtripId: "b8fb",
    },
  ],
  [
    {
      otherUserId: 51,
      roadtripId: "7d2f",
    },
    {
      otherUserId: 51,
      roadtripId: "7d2f",
    },
    {
      otherUserId: 51,
      roadtripId: "7d2f",
    },
  ],
] as MessagesDisplay[][];

const overviewMessagesMock = [
  {
    otherUserId: 62,
  },
  {
    otherUserId: 51,
  },
] as MessagesDisplay[];

const overviewMessagesWithDateMock = [
  {
    otherUserId: 62,
    created: new Date("1991-10-03"),
  },
  {
    otherUserId: 51,
    created: new Date("1991-10-07"),
  },
  {
    otherUserId: 51,
    created: new Date("1991-10-02"),
  },
] as unknown as MessagesDisplay[];

const sortedOverviewMessagesMock = [
  {
    otherUserId: 51,
    created: new Date("1991-10-07"),
  },
  {
    otherUserId: 62,
    created: new Date("1991-10-03"),
  },
  {
    otherUserId: 51,
    created: new Date("1991-10-02"),
  },
] as unknown as MessagesDisplay[];

describe("image containers appear in the document", () => {
  test.only("test nesting of messages", () => {
    const nestedMessages = nestMessageArrayByOtherUserId(messagesMock);
    expect(nestedMessages).toEqual(nestedMessagesMock);
  });

  test("overview of messages", () => {
    const overviewMessages = nestMessagesToOverviewMessages(nestedMessagesMock);
    expect(overviewMessages).toEqual(overviewMessagesMock);
  });

  test("sorting Messages", () => {
    const sortedMessages = sortMessages(overviewMessagesWithDateMock);
    expect(sortedMessages).toEqual(sortedOverviewMessagesMock);
  });
});
