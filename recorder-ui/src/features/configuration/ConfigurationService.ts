import { httpGet } from "../../utils/httpUtil";
import { ScheduleContainer, Schedule } from "./types";

export const getConfigurations = async () => {
  return httpGet<ScheduleContainer[]>("v1/configuration");
};

export const getConfiguration = async (id: string) => {
  return httpGet<Schedule>(`v1/configuration/${id}`);
};
