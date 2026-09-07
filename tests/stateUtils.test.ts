import assert from "node:assert/strict";
import test from "node:test";
import { QueryClient } from "react-query";
import { QueryKeys } from "../src/constants";
import {
  Happiness,
  HappinessPaginationResults,
} from "../src/data/models/Happiness";
import { addNewHappiness } from "../src/data/models/stateUtils";

function happiness(id: number, timestamp: string, value = -1): Happiness {
  return {
    id,
    timestamp,
    value,
    comment: "",
    author: {} as Happiness["author"],
  };
}

test("autosaving replaces an entry without duplicating it across pages", () => {
  const queryClient = new QueryClient();
  try {
    const queryKey = [
      QueryKeys.FETCH_HAPPINESS,
      QueryKeys.INFINITE,
      { start: new Date("2026-09-07") },
    ];
    const cachedData: HappinessPaginationResults = {
      pages: [
        {
          page: 0,
          data: [happiness(-1, "2026-09-07"), happiness(-2, "2026-09-06")],
        },
        {
          page: 1,
          data: [happiness(-3, "2026-08-31"), happiness(-4, "2026-08-30")],
        },
      ],
      pageParams: [undefined, 1],
    };
    queryClient.setQueryData(queryKey, cachedData);

    addNewHappiness(queryClient, happiness(42, "2026-09-07", 8));

    const updatedData =
      queryClient.getQueryData<HappinessPaginationResults>(queryKey);
    const matchingEntries = updatedData?.pages
      .flatMap((page) => page.data)
      .filter((entry) => entry.timestamp === "2026-09-07");

    assert.deepEqual(matchingEntries, [happiness(42, "2026-09-07", 8)]);
  } finally {
    queryClient.clear();
  }
});
