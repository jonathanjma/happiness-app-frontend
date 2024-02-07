import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DateArrow from "../../components/DateArrow";
import HappinessCalendar from "../../components/HappinessCalendar";
import SmallHappinessCard from "../../components/SmallHappinessCard";
import Column from "../../components/layout/Column";
import Row from "../../components/layout/Row";
import { Happiness } from "../../data/models/Happiness";
import { formatDate } from "../../utils";

export default function CalendarPanel({ userId }: { userId: number }) {
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [selectedHappiness, setSelectedHappiness] = useState<
    Happiness | undefined
  >(undefined);

  const navigate = useNavigate();

  useEffect(() => {
    console.log(`startDate: ${formatDate(startDate)}`);
  }, [startDate]);

  return (
    <Column className="scroll-hidden h-full w-full items-center overflow-scroll">
      <Row className="w-full items-baseline px-8">
        <label className="text-gray-400">
          {startDate.toLocaleString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </label>
        <div className="flex flex-1" />
        <DateArrow
          change={-1}
          variation="MONTHLY"
          setCurDates={[setStartDate]}
          dates={[startDate]}
        />
        <div className="w-1"></div>
        <DateArrow
          change={1}
          variation="MONTHLY"
          setCurDates={[setStartDate]}
          dates={[startDate]}
        />
      </Row>
      <div className="h-6" />
      <HappinessCalendar
        selectedEntry={selectedHappiness}
        onSelectEntry={setSelectedHappiness}
        startDate={startDate}
        variation="MONTHLY"
        userId={userId}
      />

      {selectedHappiness && (
        <div className="w-11/12">
          <div className="h-8" />
          <SmallHappinessCard
            happiness={selectedHappiness}
            actions={[
              {
                label: "Open In Entries",
                onClick: () => {
                  navigate(`/home?date=${selectedHappiness.timestamp}`);
                },
              },
            ]}
          />
        </div>
      )}
    </Column>
  );
}
