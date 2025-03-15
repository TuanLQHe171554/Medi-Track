import moment from "moment";

export const FormatDate = (timestam) => {
  return new Date(timestam);
};
export const FormatDataForText = (date) => {
  return moment(date).format("ll");
};
export const formatTime = (timestam) => {
  const date = new Date(timestam);
  const timeString = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return timeString;//9:00 AM
};
