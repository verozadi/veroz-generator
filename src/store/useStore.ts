'use client';

import { create } from 'zustand';
import { persist, type StateStorage, createJSONStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';
import {
    type Sticker,
    type StickerPack,
    type GenerateFormState,
    type GenerationResult,
    type UserProfile,
} from '@/lib/types';
import { generateId } from '@/lib/utils';

const idbStorage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
        return (await get(name)) || null;
    },
    setItem: async (name: string, value: string): Promise<void> => {
        await set(name, value);
    },
    removeItem: async (name: string): Promise<void> => {
        await del(name);
    },
};

interface AppState {
    // Form State
    form: GenerateFormState;
    setForm: (partial: Partial<GenerateFormState>) => void;
    resetForm: () => void;

    // Generation Results (live preview)
    results: GenerationResult[];
    setResults: (results: GenerationResult[]) => void;
    updateResult: (index: number, data: Partial<GenerationResult>) => void;

    // Collection
    stickers: Sticker[];
    addSticker: (sticker: Omit<Sticker, 'id' | 'createdAt' | 'favorite' | 'packIds'>) => string;
    removeSticker: (id: string) => void;
    toggleFavorite: (id: string) => void;
    updateSticker: (id: string, data: Partial<Sticker>) => void;

    // Packs
    packs: StickerPack[];
    addPack: (name: string) => string;
    removePack: (id: string) => void;
    updatePack: (id: string, data: Partial<StickerPack>) => void;
    addStickerToPack: (stickerId: string, packId: string) => void;
    removeStickerFromPack: (stickerId: string, packId: string) => void;

    // User / Quota
    user: UserProfile;
    incrementGenerations: (count: number) => void;
    setUser: (user: Partial<UserProfile>) => void;

    // UI State
    activeTab: 'generator' | 'gallery' | 'editor';
    setActiveTab: (tab: 'generator' | 'gallery' | 'editor') => void;
    editorImage: string | null;
    setEditorImage: (url: string | null) => void;
}

const defaultForm: GenerateFormState = {
    prompt: '',
    optimizedPrompt: '',
    stickerName: '',
    stickerText: '',
    stickerEmoji: '',
    style: '2D Flat',
    aspectRatio: '1:1',
    customWidth: 1024,
    customHeight: 1024,
    generateCount: 1,
    aiModel: 'pollinations',
    promptAI: 'gemini',
    isTransparent: true,
    bgColor: '#ffffff',
    textFont: 'Inter',
    textPosition: 'bottom',
    referenceImage: null,
    referenceMode: 'full',
};

const defaultUser: UserProfile = {
    id: 'guest',
    generationsUsed: 0,
    generationsLimit: 10,
    isGuest: true,
};

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            form: defaultForm,
            setForm: (partial) => set((s) => ({ form: { ...s.form, ...partial } })),
            resetForm: () => set({ form: defaultForm }),

            results: [],
            setResults: (results) => set({ results }),
            updateResult: (index, data) =>
                set((s) => {
                    const updated = [...s.results];
                    updated[index] = { ...updated[index], ...data };
                    return { results: updated };
                }),

            stickers: [],
            addSticker: (sticker) => {
                const id = generateId();
                set((s) => ({
                    stickers: [
                        { ...sticker, id, createdAt: Date.now(), favorite: false, packIds: [] },
                        ...s.stickers,
                    ],
                }));
                return id;
            },
            removeSticker: (id) =>
                set((s) => ({
                    stickers: s.stickers.filter((st) => st.id !== id),
                })),
            toggleFavorite: (id) =>
                set((s) => ({
                    stickers: s.stickers.map((st) =>
                        st.id === id ? { ...st, favorite: !st.favorite } : st,
                    ),
                })),
            updateSticker: (id, data) =>
                set((s) => ({
                    stickers: s.stickers.map((st) => (st.id === id ? { ...st, ...data } : st)),
                })),

            packs: [],
            addPack: (name) => {
                const id = generateId();
                set((s) => ({
                    packs: [{ id, name, stickerIds: [], createdAt: Date.now() }, ...s.packs],
                }));
                return id;
            },
            removePack: (id) =>
                set((s) => ({
                    packs: s.packs.filter((p) => p.id !== id),
                    stickers: s.stickers.map((st) => ({
                        ...st,
                        packIds: st.packIds.filter((pid) => pid !== id),
                    })),
                })),
            updatePack: (id, data) =>
                set((s) => ({
                    packs: s.packs.map((p) => (p.id === id ? { ...p, ...data } : p)),
                })),
            addStickerToPack: (stickerId, packId) =>
                set((s) => ({
                    packs: s.packs.map((p) =>
                        p.id === packId && !p.stickerIds.includes(stickerId)
                            ? { ...p, stickerIds: [...p.stickerIds, stickerId] }
                            : p,
                    ),
                    stickers: s.stickers.map((st) =>
                        st.id === stickerId && !st.packIds.includes(packId)
                            ? { ...st, packIds: [...st.packIds, packId] }
                            : st,
                    ),
                })),
            removeStickerFromPack: (stickerId, packId) =>
                set((s) => ({
                    packs: s.packs.map((p) =>
                        p.id === packId
                            ? { ...p, stickerIds: p.stickerIds.filter((id) => id !== stickerId) }
                            : p,
                    ),
                    stickers: s.stickers.map((st) =>
                        st.id === stickerId
                            ? { ...st, packIds: st.packIds.filter((id) => id !== packId) }
                            : st,
                    ),
                })),

            user: defaultUser,
            incrementGenerations: (count) =>
                set((s) => ({ user: { ...s.user, generationsUsed: s.user.generationsUsed + count } })),
            setUser: (data) => set((s) => ({ user: { ...s.user, ...data } })),

            activeTab: 'generator',
            setActiveTab: (tab) => set({ activeTab: tab }),
            editorImage: null,
            setEditorImage: (editorImage) => set({ editorImage }),
        }),
        {
            name: 'veroz-store',
            partialize: (s) => ({
                stickers: s.stickers,
                packs: s.packs,
                user: s.user,
                form: {
                    style: s.form.style,
                    aspectRatio: s.form.aspectRatio,
                    generateCount: s.form.generateCount,
                    aiModel: s.form.aiModel,
                    promptAI: s.form.promptAI,
                    isTransparent: s.form.isTransparent,
                },
            }),
            merge: (persisted: unknown, current: AppState): AppState => {
                const p = persisted as Partial<AppState> | undefined;
                return {
                    ...current,
                    ...p,
                    form: { ...defaultForm, ...(p?.form ?? {}) },
                    user: { ...defaultUser, ...(p?.user ?? {}) },
                };
            },
            storage: createJSONStorage(() => idbStorage),
        },
    ),
);
