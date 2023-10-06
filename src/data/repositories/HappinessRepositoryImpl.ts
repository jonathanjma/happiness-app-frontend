import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { HappinessRepository } from "./HappinessRepository";

export class HappinessRepositoryImpl implements HappinessRepository {
  getHappiness = () =>
    useQuery({
      queryKey: ["test"],
      queryFn: () => axios.get("/users").then((res) => res.data), // TODO axios goes here
    });
  getHappinessByDay = () =>
    useQuery({
      queryKey: ["test"],
      queryFn: () => axios.get("/users").then((res) => res.data), // TODO axios goes here
    });
}
