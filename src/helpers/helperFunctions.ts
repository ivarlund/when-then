import { Question } from "@/data/types";

export function getYearDisplayText(year: number) {
    return year < 0 ? year.toString().substring(1) + ' BC' : year;
}

export function parseQuestions(str: string): Question[] {
    const regex = /{([^}]+)}/g;
    const questions: Question[] = [];
    let match;
    while ((match = regex.exec(str)) !== null) {
        try {
            const questionObj = JSON.parse(match[0]);
            const { id, question, answer, description } = questionObj;
            if (typeof id === "number" && typeof question === "string" && typeof answer === "number" && typeof description === "string") {
                questions.push({ id, question, answer, description });
            }
        } catch (err) {
            console.error(`Error parsing question object: ${match[0]}. Skipping...`);
        }
    }
    return questions;
}

// Fix type
export function getWinningTeamIndex(teams: any) {
    let winningTeamIndex = -1;
    Object.keys(teams).some((team, index) => {
        teams[team].timeline.length === 10 && (winningTeamIndex = index);
    });
    return winningTeamIndex;
}
