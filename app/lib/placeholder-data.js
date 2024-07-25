// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data
const users = [
  {
    id: "1",
    name: "Flemming",
    email: "user@nextmail.com",
    password: "Nighel123@gmail.com",
    birthday: "1991-12-06",
    sex: "weiblich",
    emailVerified: "2024-07-24 10:03:49.238+00",
  },
  {
    id: "2",
    name: "Nighel123",
    email: "nighel@nextmail.com",
    password: "Nighel123@gmail.com",
    birthday: "1999-12-06",
    sex: "männlich",
    emailVerified: "2024-07-24 10:03:49.238+00",
  },
  {
    id: "3",
    name: "Hannah",
    email: "Hannah@nextmail.com",
    password: "Nighel123@gmail.com",
    birthday: "2002-12-06",
    sex: "männlich",
    emailVerified: "2024-07-24 10:03:49.238+00",
  },
];

const addresses = [
  {
    id: "3958dc9e-712f-4377-85e9-fec4b6a6442a",
    land: "Deutschland",
    town: "Berlin",
  },
  {
    id: "3958dc9e-742f-4377-85e9-fec4b6a6442a",
    land: "Frankreich",
    town: "Paris",
  },
  {
    id: "3958dc9e-737f-4377-85e9-fec4b6a6442a",
    land: "Italien",
    town: "Rom",
  },
  {
    id: "50ca3e18-62cd-11ee-8c99-0242ac120002",
    land: "Spanien",
    town: "Barcelona",
  },
  {
    id: "3958dc9e-787f-4377-85e9-fec4b6a6442a",
    land: "Norwegen",
    town: "Oslo",
  },
  {
    id: "3958dc9e-787f-4377-85e9-fec4b6a6442a",
    land: "Finnland",
    town: "Helsinki",
  },
];

const roadtrips = [
  {
    user_id: users[0].id,
    start_id: addresses[0].id,
    dest_id: addresses[1].id,
    date: "2022-12-06",
    image_url: ".png",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
  },
  {
    user_id: users[0].id,
    start_id: addresses[1].id,
    dest_id: addresses[2].id,
    date: "2022-12-06",
    image_url: ".png",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
  },
  {
    user_id: users[1].id,
    start_id: addresses[2].id,
    dest_id: addresses[3].id,
    date: "2022-12-06",
    image_url: ".png",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
  },
  {
    user_id: users[2].id,
    start_id: addresses[4].id,
    dest_id: addresses[5].id,
    date: "2022-12-06",
    image_url: ".png",
    description:
      "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
  },
];

module.exports = {
  users,
  addresses,
  roadtrips,
};
