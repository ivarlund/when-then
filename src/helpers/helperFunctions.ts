export function getYearDisplayText(year: number) {
    return year < 0 ? year.toString().substring(1) + ' BC' : year;
}
