import { useQuery } from "@tanstack/react-query";
import ApiClient from "../../ApiClient";

export class HappinessRepository {
  api;
  constructor(api: ApiClient) {
    this.api = api;
  }
  getHappiness = () =>
    useQuery({
      queryKey: ["test"],
      queryFn: () => this.api.get("/user/self").then((res) => res.data), // TODO axios goes here
    });
  getHappinessByDay = () =>
    useQuery({
      queryKey: ["test"],
      queryFn: () => this.api.get("/users").then((res) => res.data), // TODO axios goes here
    });
}
