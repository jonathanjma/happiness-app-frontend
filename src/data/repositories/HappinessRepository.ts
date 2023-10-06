import { UseQueryResult } from "@tanstack/react-query";
import { Happiness } from "../models/Happiness";

export interface HappinessRepository {
  getHappiness: () => UseQueryResult<Happiness, unknown>;
  getHappinessByDay: (d: Date) => UseQueryResult<Happiness, unknown>;
}
