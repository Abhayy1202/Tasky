const getPriority = (due_date) => {
  const today = new Date();
  const dueDate = new Date(due_date);
  let priority;

  if (dueDate.toDateString() === today.toDateString()) {
    priority = "High";
  } else {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);

    if (dueDate > tomorrow && dueDate <= dayAfterTomorrow) {
      priority = Medium;
    } else if (
      dueDate > dayAfterTomorrow &&
      dueDate <= today.setDate(today.getDate() + 4)
    ) {
      priority = "Low";
    } else {
      priority = "Low";
    }
  }

  return priority;
};

export {getPriority};
