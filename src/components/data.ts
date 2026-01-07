// Activity data with images and instructions
import walkImg from '../assets/walk.png';
import musicImg from '../assets/music.png';
import breathImg from '../assets/breath.png';

export interface Activity {
    name: string;
    rating: number;
    times: number;
    image: string | null;
    instructions: string[];
}

export const activities: Activity[] = [
    {
        name: 'Walk',
        rating: 4.8,
        times: 5,
        image: walkImg,
        instructions: [
            'Put on comfortable shoes and clothes',
            'Step outside or use a treadmill',
            'Walk at a relaxed pace for 10-15 minutes',
            'Focus on your breathing and surroundings',
            'Gradually return to your starting point'
        ]
    },
    {
        name: 'Listen to music',
        rating: 4.0,
        times: 4,
        image: musicImg,
        instructions: [
            'Find a quiet, comfortable space',
            'Put on headphones for best experience',
            'Choose calming or favorite music',
            'Close your eyes and focus on the melody',
            'Let the music guide your breathing'
        ]
    },
    {
        name: 'Breathe',
        rating: 4.0,
        times: 2,
        image: breathImg,
        instructions: [
            'Sit or lie down comfortably',
            'Inhale slowly through your nose for 4 seconds',
            'Hold your breath for 4 seconds',
            'Exhale slowly through your mouth for 6 seconds',
            'Repeat 5-10 times'
        ]
    },
    {
        name: 'Stretch',
        rating: 2.5,
        times: 2,
        image: null,
        instructions: [
            'Stand up and find some space',
            'Reach your arms above your head',
            'Gently bend to each side',
            'Roll your shoulders back and forward',
            'Hold each stretch for 15-30 seconds'
        ]
    },
    {
        name: 'Draw',
        rating: 3.5,
        times: 2,
        image: null,
        instructions: [
            'Get paper and pencils or pens',
            'Find a quiet spot to sit',
            'Draw anything that comes to mind',
            'Focus on the process, not the result',
            'Spend at least 10 minutes drawing'
        ]
    },
    {
        name: 'Sudoku',
        rating: 3.5,
        times: 2,
        image: null,
        instructions: [
            'Open a Sudoku app or get a puzzle book',
            'Start with an easy difficulty level',
            'Focus on one section at a time',
            'Use logic to fill in the numbers',
            'Take breaks if you feel frustrated'
        ]
    },
    {
        name: 'Yoga',
        rating: 0,
        times: 0,
        image: null,
        instructions: [
            'Find a quiet space with a mat',
            'Start with basic stretching poses',
            'Focus on your breathing throughout',
            'Hold each pose for 30-60 seconds',
            'End with a few minutes of relaxation'
        ]
    },
];

// Simulated daily stats data
export const dailyStats = [
    { date: '21.12', level: 15 },
    { date: '20.12', level: 20 },
    { date: '19.12', level: 70 },
    { date: '18.12', level: 25 },
    { date: '17.12', level: 30 },
];

// Helper functions
export const getStressEmoji = (level: number): string => {
    if (level <= 25) return '😊';
    if (level <= 50) return '😐';
    if (level <= 75) return '😟';
    return '😰';
};

export const getStressColor = (level: number): string => {
    if (level <= 25) return '#59f73dff';
    if (level <= 50) return '#FFD93D';
    if (level <= 75) return '#FFB347';
    return '#FF6B6B';
};

export const getSuggestedActivity = (threshold: number): Activity | undefined => {
    if (threshold >= 75) return activities.find(a => a.name === 'Breathe');
    if (threshold >= 50) return activities.find(a => a.name === 'Listen to music');
    return activities.find(a => a.name === 'Walk');
};
