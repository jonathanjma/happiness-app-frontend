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
  return (
    <div>
      <p className="text-black">Hello world!</p>
      <div className="hs-dropdown relative inline-flex">
        <button
          id="hs-dropdown-default"
          type="button"
          className="hs-dropdown-toggle inline-flex items-center justify-center gap-2 rounded-md border bg-white px-4 py-3 align-middle text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white dark:border-gray-700 dark:bg-slate-900 dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-white dark:focus:ring-offset-gray-800"
        >
          Actions
          <svg
            className="h-2.5 w-2.5 text-gray-600 hs-dropdown-open:rotate-180"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>

        <div
          className="hs-dropdown-menu z-10 mt-2 hidden w-72 min-w-[15rem] rounded-lg bg-white p-2 opacity-0 shadow-md transition-[opacity,margin] duration-[0.1ms] hs-dropdown-open:opacity-100 dark:divide-gray-700 dark:border dark:border-gray-700 dark:bg-gray-800"
          aria-labelledby="hs-dropdown-default"
        >
          <a
            className="flex items-center gap-x-3.5 rounded-md px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            href="#"
          >
            Newsletter
          </a>
          <a
            className="flex items-center gap-x-3.5 rounded-md px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            href="#"
          >
            Purchases
          </a>
          <a
            className="flex items-center gap-x-3.5 rounded-md px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            href="#"
          >
            Downloads
          </a>
          <a
            className="flex items-center gap-x-3.5 rounded-md px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            href="#"
          >
            Team Account
          </a>
        </div>
      </div>
    </div>
  );
}
