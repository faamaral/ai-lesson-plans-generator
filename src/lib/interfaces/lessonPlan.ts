import { GeneratedPlan } from "./generatedPlan"

export interface LessonPlan extends GeneratedPlan {
    teaching_level: string,
    discipline: string,
    grade: string,
    theme: string,
    bncc_codes: string,
    duration: string,
    extra_objective: string
}