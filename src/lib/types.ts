export interface Sticker {
    id: string;
    url: string;
    prompt: string;
    optimizedPrompt?: string;
    style: string;
    aspectRatio: string;
    width: number;
    height: number;
    name?: string;
    text?: string;
    emoji?: string;
    isTransparent: boolean;
    bgColor?: string;
    favorite: boolean;
    packIds: string[];
    createdAt: number;
    tags?: string[];
}

export interface StickerPack {
    id: string;
    name: string;
    coverId?: string;
    stickerIds: string[];
    createdAt: number;
}

export type Style =
    | '2D Flat'
    | '3D Render'
    | 'Animated'
    | 'Kawaii'
    | 'Pixel Art'
    | 'Neon Glow'
    | 'Watercolor'
    | 'Comic'
    | 'Minimalist'
    | 'Retro'
    | 'Holographic'
    | 'Emoji';

export type AIModel = 'pollinations' | 'huggingface' | 'together';
export type PromptAI = string;
export type ReferenceMode = 'full' | 'face' | 'body';
export type TextPosition = 'top' | 'center' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface GenerateFormState {
    prompt: string;
    optimizedPrompt: string;
    stickerName: string;
    stickerText: string;
    stickerEmoji: string;
    style: Style;
    aspectRatio: string;
    customWidth: number;
    customHeight: number;
    generateCount: number;
    aiModel: AIModel;
    promptAI: PromptAI;
    isTransparent: boolean;
    bgColor: string;
    textFont: string;
    textPosition: TextPosition;
    referenceImage: string | null;
    referenceMode: ReferenceMode;
}

export interface GenerationResult {
    id: string;
    url: string | null;
    status: 'loading' | 'done' | 'error';
    error?: string;
}

export interface UserProfile {
    id: string;
    email?: string;
    generationsUsed: number;
    generationsLimit: number;
    isGuest: boolean;
}
