import { Question, ServiceParameters } from "@/data/types";

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

export function getGPTQuery(category: string) {
    return `"Generate 10 questions ${'about ' + category} in the following format: {\"id\": <unique_id>,\"question\": \"In what year was <random_event>?\",\"answer\": <random_year>,\"description\": \"<random_event> took place in <random_year>.\"}\"`;
}

// Is there a point to do this?
export async function callService({ url, method, body, headers }: ServiceParameters) {
    try {
        const response = await fetch(url, {
            method,
            headers,
            body: JSON.stringify(body),
        });

        if (response.status === 200) {
            return await response.json();
        } else {
            console.error(`Unexpected response status: ${response.status}`);
            throw new Error(`Unexpected response status: ${response.status}`);
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}