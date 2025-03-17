import moment from "moment";

export const FormatDate = (timestam) => {
  return new Date(timestam).setHours(0, 0, 0, 0);
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
 
export const getDateRange = (startDate, endDate) => {
  const start = moment(new Date(startDate),'MM/DD/YYYY');
  const end = moment(new Date(endDate),'MM/DD/YYYY');
  const dates = [];
  while (start.isSameOrBefore(end)) {
    dates.push(start.format('MM/DD/YYYY'));
    start.add(1, 'day'); 
  }
  return dates;
};

export const getDateRangeToDisplay =() =>{
  const dateList = [];
  for (let i = 0; i < 7; i++) {
    dateList.push({
      date: moment().add(i, 'days').format('DD'),//27
      day: moment().add(i, 'days').format('dd'),//Thu
      formatedDate: moment().add(i, 'days').format('L')//27/06/2023 
    })
  }
  return dateList;
}