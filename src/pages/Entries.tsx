import { useQuery } from "@tanstack/react-query";
import React from "react";
import { HappinessRepository } from "../data/repositories/HappinessRepository";
import { HappinessRepositoryImpl } from "../data/repositories/HappinessRepositoryImpl";

export default function Entries({
  happinessRepository,
}: {
  happinessRepository: HappinessRepository;
}) {
  const { data } = happinessRepository.getHappiness();
  return <p className="text-black">Hello world!</p>;
}
