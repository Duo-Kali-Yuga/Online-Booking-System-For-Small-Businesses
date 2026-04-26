import dayjs from "dayjs";

export const isNew = (createdAt) => {
  return dayjs().diff(dayjs(createdAt), "hour") < 24;
};