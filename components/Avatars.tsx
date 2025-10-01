import React from 'react';

const Avatar1: React.FC = () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#22d3ee"/>
        <circle cx="35" cy="40" r="5" fill="white"/>
        <circle cx="65" cy="40" r="5" fill="white"/>
        <path d="M30 65 Q 50 80, 70 65" stroke="white" strokeWidth="4" strokeLinecap="round"/>
    </svg>
);

const Avatar2: React.FC = () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#a78bfa"/>
        <rect x="30" y="35" width="10" height="15" fill="white"/>
        <rect x="60" y="35" width="10" height="15" fill="white"/>
        <rect x="35" y="65" width="30" height="8" rx="4" fill="white"/>
    </svg>
);

const Avatar3: React.FC = () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#facc15"/>
        <path d="M30 45 L 40 35 L 50 45 L 60 35 L 70 45" stroke="black" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M30 65 Q 50 55, 70 65" stroke="black" strokeWidth="4" strokeLinecap="round"/>
    </svg>
);

const Avatar4: React.FC = () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#4ade80"/>
        <path d="M35 35 L 65 35" stroke="black" strokeWidth="5" strokeLinecap="round" />
        <path d="M35 45 L 65 45" stroke="black" strokeWidth="5" strokeLinecap="round" />
        <circle cx="50" cy="65" r="10" fill="black"/>
    </svg>
);

const Avatar5: React.FC = () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#f87171"/>
        <path d="M30 40 L 40 40" stroke="white" strokeWidth="6" strokeLinecap="round"/>
        <path d="M60 40 L 70 40" stroke="white" strokeWidth="6" strokeLinecap="round"/>
        <path d="M40 70 C 45 60, 55 60, 60 70" stroke="white" strokeWidth="5" strokeLinecap="round" />
    </svg>
);


const Avatar6: React.FC = () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#60a5fa"/>
        <path d="M35 40 Q 50 25, 65 40" stroke="white" strokeWidth="5" />
        <path d="M35 70 Q 50 85, 65 70" stroke="white" strokeWidth="5" />
    </svg>
);

export const AVATAR_LIST = [
    { id: 'avatar1', component: Avatar1 },
    { id: 'avatar2', component: Avatar2 },
    { id: 'avatar3', component: Avatar3 },
    { id: 'avatar4', component: Avatar4 },
    { id: 'avatar5', component: Avatar5 },
    { id: 'avatar6', component: Avatar6 },
];

const avatarMap: { [key: string]: React.FC } = {
    avatar1: Avatar1,
    avatar2: Avatar2,
    avatar3: Avatar3,
    avatar4: Avatar4,
    avatar5: Avatar5,
    avatar6: Avatar6,
};

export const getAvatarById = (id: string): React.FC => {
    return avatarMap[id] || Avatar1;
};