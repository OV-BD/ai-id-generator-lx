
export const MasteryBehaviors: string[] = [
  'Confidence',
  'Efficiency',
  'Accuracy',
  'Consistency',
  'Goal Attainment',
  'Completion',
  'Adherence to Standards',
];

export const initialMasteryBehaviors: Record<string, boolean> = MasteryBehaviors.reduce((acc, behavior) => {
  acc[behavior] = false;
  return acc;
}, {} as Record<string, boolean>);
