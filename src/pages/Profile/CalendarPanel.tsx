import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DateArrow from "../../components/DateArrow";
import HappinessCalendar from "../../components/HappinessCalendar";
import SmallHappinessCard from "../../components/SmallHappinessCard";
import Column from "../../components/layout/Column";
import Row from "../../components/layout/Row";
import { Happiness } from "../../data/models/Happiness";
import { useUser } from "../../contexts/UserProvider";

export default function CalendarPanel({
  userId,
  setEntry,
}: {
  userId: number;
  setEntry: React.Dispatch<React.SetStateAction<Happiness | undefined>>;
}) {
  const { user } = useUser();
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [selectedHappiness, setSelectedHappiness] = useState<
    Happiness | undefined
  >(undefined);

  const navigate = useNavigate();

  return (
    <Column className="scroll-hidden h-full w-full items-center overflow-scroll px-8">
      <Row className="mb-4 w-full items-baseline px-4">
        <label className="text-gray-400">
          {startDate.toLocaleString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </label>
        <div className="flex flex-1" />
        <DateArrow
          change={1}
          variation="MONTHLY"
          setCurDates={[setStartDate]}
          dates={[startDate]}
        />
        <div className="w-1"></div>
        <DateArrow
          change={-1}
          variation="MONTHLY"
          setCurDates={[setStartDate]}
          dates={[startDate]}
        />
      </Row>
      <HappinessCalendar
        selectedEntry={selectedHappiness}
        onSelectEntry={setSelectedHappiness}
        startDate={startDate}
        variation="MONTHLY"
        userId={userId}
      />

      {selectedHappiness && (
        <div>
          <div className="h-8" />
          <SmallHappinessCard
            happiness={selectedHappiness}
            actions={
              userId === user!.id
                ? [
                    {
                      label: "Open In Entries",
                      onClick: () => {
                        navigate(`/home?date=${selectedHappiness.timestamp}`);
                      },
                    },
                  ]
                : [
                    {
                      label: "Expand",
                      modalId: "happiness-viewer",
                      onClick: () => {
                        setEntry(selectedHappiness);
                      },
                    },
                  ]
            }
          />
        </div>
      )}
    </Column>
  );
}
