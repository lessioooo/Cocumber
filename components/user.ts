export interface userGoal {
    targetWeight: number;
    targetDate: Date;
    dailyProtein: number;
    dailyCarbs: number;
    dailyFats: number;
    dailyCalories: number;
    dailyWaterIntake: number;
}
    

export interface User {
    id: string;
    name: string;
    currentWeight: number;
    age: number;
    gender: string;
    goal: userGoal;
    activityLevel: string;
}