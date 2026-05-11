export interface Food{
    id: string;
    name: string;
    calories: number;
    macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}