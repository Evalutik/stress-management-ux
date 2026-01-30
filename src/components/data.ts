// Activity data with images, instructions, descriptions, and icons
import walkImg from '../assets/walk.png';
import musicImg from '../assets/music.png';
import breathImg from '../assets/breath.png';

export interface Activity {
    name: string;
    rating: number;
    times: number;
    image: string | null;
    icon: string;  // Icon identifier for animated icon component
    description: string;
    instructions: string[];
}

export const activities: Activity[] = [
    {
        name: 'Walk',
        rating: 4.8,
        times: 5,
        image: walkImg,
        icon: 'walk',
        description: 'Walking is one of the most effective ways to reduce stress. It combines gentle physical exercise with a change of scenery, helping to clear your mind and release tension. Even a short 10-minute walk can significantly lower cortisol levels.',
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
        icon: 'music',
        description: 'Music has a powerful effect on the brain, triggering the release of dopamine and reducing anxiety. Listening to calming melodies can slow your heart rate, lower blood pressure, and create a sense of peace and emotional balance.',
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
        icon: 'breathe',
        description: 'Deep breathing activates your parasympathetic nervous system, which controls relaxation. By focusing on slow, deliberate breaths, you signal your body to calm down, reducing heart rate and promoting mental clarity.',
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
        icon: 'stretch',
        description: 'Stretching releases physical tension stored in your muscles, especially in the neck, shoulders, and back. It improves blood circulation and helps break the cycle of stress that manifests as physical tightness.',
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
        icon: 'draw',
        description: 'Drawing engages the creative part of your brain, providing a healthy distraction from stressful thoughts. The repetitive motion of sketching can be meditative, helping you enter a flow state where worries fade away.',
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
        icon: 'puzzle',
        description: 'Puzzle-solving redirects your mental energy from stressors to a focused, logical task. Completing puzzles provides a sense of accomplishment and helps train your brain to approach problems calmly and methodically.',
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
        icon: 'yoga',
        description: 'Yoga combines physical postures, breathing exercises, and meditation to create a holistic stress-relief practice. Regular yoga practice has been shown to reduce anxiety, improve mood, and increase overall well-being.',
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
    { date: '16.12', level: 85 },
    { date: '15.12', level: 45 },
    { date: '14.12', level: 60 },
    { date: '13.12', level: 35 },
    { date: '12.12', level: 10 },
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

export const getRandomActivity = (): Activity => {
    const randomIndex = Math.floor(Math.random() * activities.length);
    return activities[randomIndex];
};
