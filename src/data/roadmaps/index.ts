import aiCoding from "./ai-coding.json";
import webFullstack from "./web-fullstack.json";

export interface RoadmapItem {
    id: string;
    text: string;
    completed: boolean;
    children?: RoadmapItem[];
}

export interface RoadmapSection {
    title: string;
    subtitle?: string;
    items: RoadmapItem[];
}

export interface Roadmap {
    id: string;
    isActive: boolean;
    title: string;
    description: string;
    sections: RoadmapSection[];
}

export const roadmaps: Roadmap[] = [
    aiCoding,
    webFullstack
];

export function getActiveRoadmap(): Roadmap {
    return roadmaps.find(r => r.isActive) || roadmaps[0];
}

export function getRoadmapById(id: string): Roadmap | undefined {
    return roadmaps.find(r => r.id === id);
}
