export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function validateHappiness(happiness: number | undefined) {
  return (
    happiness !== undefined &&
    happiness % 0.5 === 0 &&
    happiness >= 0 &&
    happiness <= 10
  );
}
