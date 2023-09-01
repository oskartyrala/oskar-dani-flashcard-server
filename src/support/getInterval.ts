export default function getInterval(streak: number): number {
    switch (streak) {
        case 4:
            return 5;

        case 5:
            return 7;

        case 6:
            return 10;

        case 7:
            return 14;

        case 8:
            return 30;

        case 9:
            return 60;

        case 10:
            return 180;

        default:
            return streak;
    }
}
