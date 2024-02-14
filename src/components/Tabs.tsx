import React from "react";

export function TabButton({
  index,
  icon,
  title,
}: {
  index: number;
  icon: string;
  title: string;
}) {
  const tabButtonClasses =
    "hs-tab-active:border-gray-800 hs-tab-active:text-gray-800 inline-flex items-center gap-x-2 border-b-2 border-transparent px-4 py-2 text-sm font-medium text-gray-600 hs-tab-active:font-bold";

  return (
    <button
      type="button"
      className={tabButtonClasses + (index === 1 ? " active" : "")}
      id={"tab-" + index}
      data-hs-tab={"#tab-panel-" + index}
      aria-controls={"tab-panel-" + index}
      role="tab"
    >
      <img src={icon} className="m-1 max-w-[18px]" />
      {title}
    </button>
  );
}

export function TabPanel({
  index,
  children,
}: {
  index: number;
  children: React.ReactElement;
}) {
  return (
    <div
      id={"tab-panel-" + index}
      className={"h-full overflow-y-auto " + (index !== 1 ? "hidden" : "")}
      role="tabpanel"
      aria-labelledby={"tab-" + index}
    >
      {children}
    </div>
  );
}
