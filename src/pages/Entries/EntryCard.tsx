import React from "react";
import Column from "../../components/layout/Column";
import Row from "../../components/layout/Row";
import Button from "../../components/Button";
import EditIcon from "../../assets/EditIcon";

export default function EntryCard() {
  return (
    <Column className="items-stretch bg-white rounded-2xl mt-8 mb-4 mx-8 shadow-2xl">
      {/* date, public entry, score, comment, and edit button are here */}
      <Column className="mt-8 mx-8 h-1/12 flex-1">
        {/* Header text */}
        <Row className=" items-center">
          <p className="text-dark_gray">You don't have a private entry</p>
          <span className="w-3" />
          <p
            className="clickable-text underline leading-4 hover:cursor-pointer text-secondary font-semibold"
            onClick={() => {
              console.log("navigate to journal");
            }}
          >
            Create a Private Entry
          </p>
        </Row>

        <div className=" h-4" />

        {/* Public entry and edit button */}
        <Row>
          <Column>
            <h4>Public Entry</h4>
            <h5 className=" text-dark_gray">
              {new Date().toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h5>
          </Column>
          <div className="flex-1" />
          <Button label="Edit Entry" icon={<EditIcon />} />
        </Row>
        {/* <Box className="flex flex-row pt-4">
              <Box className="flex flex-col">
                <Typography variant="h5" className=" font-medium ">
                  Public Entry
                </Typography>
                <Typography className="subheader">
                  {readableDateFormat(
                    new Date(allEntries[selectedEntry].timestamp)
                  )}
                </Typography>
              </Box>
              <Box className="flex-1" />
              <Button
                className="bg-[#F7EFD7] py-3 pl-3 normal-case clickable-text rounded-xl shadow-medium text-sm"
                startIcon={<EditIcon />}
              >
                Edit Entry
              </Button>
            </Box> */}
        {/* Happiness score and entry box */}
        {/* <Box className="mt-6 flex flex-row w-full">
              <Box className="w-20 h-20 items-center justify-center flex flex-col ">
                <h1 className="score-text">
                  {allEntries[selectedEntry].value}
                </h1>
              </Box>
              <Box className="ml-6 flex-1 ">
                <h4 className="body1">{allEntries[selectedEntry].comment}</h4>
              </Box>
            </Box> */}
      </Column>
    </Column>
  );
}
