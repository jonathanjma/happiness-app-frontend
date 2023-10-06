import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export class HappinessRepository {
  getHappiness = () =>
    useQuery({
      queryKey: ["test"],
      queryFn: () => axios.get("/user/self").then((res) => res.data), // TODO axios goes here
    });
  getHappinessByDay = () =>
    useQuery({
      queryKey: ["test"],
      queryFn: () => axios.get("/users").then((res) => res.data), // TODO axios goes here
    });
}
