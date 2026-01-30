import { Footprints, Music, Wind, MoveVertical, Pencil, Grid3X3, Flower2 } from 'lucide-react';

interface AnimatedActivityIconProps {
    icon: string;
    size?: number;
}

export default function AnimatedActivityIcon({ icon, size = 80 }: AnimatedActivityIconProps) {
    const getIconComponent = () => {
        const iconProps = { size, strokeWidth: 1.5 };

        switch (icon) {
            case 'walk':
                return (
                    <div className="animated-icon animated-icon-walk">
                        <Footprints {...iconProps} />
                    </div>
                );
            case 'music':
                return (
                    <div className="animated-icon animated-icon-music">
                        <Music {...iconProps} />
                        <div className="music-waves">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                );
            case 'breathe':
                return (
                    <div className="animated-icon animated-icon-breathe">
                        <Wind {...iconProps} />
                    </div>
                );
            case 'stretch':
                return (
                    <div className="animated-icon animated-icon-stretch">
                        <MoveVertical {...iconProps} />
                    </div>
                );
            case 'draw':
                return (
                    <div className="animated-icon animated-icon-draw">
                        <Pencil {...iconProps} />
                    </div>
                );
            case 'puzzle':
                return (
                    <div className="animated-icon animated-icon-puzzle">
                        <Grid3X3 {...iconProps} />
                    </div>
                );
            case 'yoga':
                return (
                    <div className="animated-icon animated-icon-yoga">
                        <Flower2 {...iconProps} />
                    </div>
                );
            default:
                return (
                    <div className="animated-icon">
                        <Wind {...iconProps} />
                    </div>
                );
        }
    };

    return (
        <div className="animated-icon-container">
            {getIconComponent()}
        </div>
    );
}
