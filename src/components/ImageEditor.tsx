'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Stage, Layer, Image as KonvaImage, Text as KonvaText, Transformer, Group, Circle, Line } from 'react-konva';
import useImage from 'use-image';
import { Download, Type, Image as ImageIcon, Trash2, Undo, Redo, Eraser, Move, Crop, Maximize } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import Konva from 'konva';

// ----- Interfaces -----
type ToolMode = 'select' | 'erase';
interface ShapeObj {
    id: string;
    type: 'text' | 'image';
    x: number;
    y: number;
    rotation?: number;
    scaleX?: number;
    scaleY?: number;
    text?: string;
    src?: string;
    fontSize?: number;
    fill?: string;
}

interface EraseLineObj {
    id: string;
    points: number[];
    strokeWidth: number;
}

// ----- Individual Components -----
const URLImage = ({ shapeProps, isSelected, onSelect, onChange }: any) => {
    const [img] = useImage(shapeProps.src, 'anonymous');
    const shapeRef = useRef<Konva.Image>(null);
    const trRef = useRef<Konva.Transformer>(null);

    useEffect(() => {
        if (isSelected && trRef.current && shapeRef.current) {
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer()?.batchDraw();
        }
    }, [isSelected]);

    return (
        <React.Fragment>
            <KonvaImage
                onClick={onSelect}
                onTap={onSelect}
                ref={shapeRef}
                {...shapeProps}
                image={img}
                draggable
                onDragEnd={(e) => {
                    onChange(shapeProps.id, {
                        ...shapeProps,
                        x: e.target.x(),
                        y: e.target.y(),
                    });
                }}
                onTransformEnd={(e) => {
                    const node = shapeRef.current;
                    if (!node) return;
                    onChange(shapeProps.id, {
                        ...shapeProps,
                        x: node.x(),
                        y: node.y(),
                        scaleX: node.scaleX(),
                        scaleY: node.scaleY(),
                        rotation: node.rotation(),
                    });
                }}
            />
            {isSelected && (
                <Transformer
                    ref={trRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        if (newBox.width < 5 || newBox.height < 5) return oldBox;
                        return newBox;
                    }}
                />
            )}
        </React.Fragment>
    );
};

const EditableText = ({ shapeProps, isSelected, onSelect, onChange }: any) => {
    const shapeRef = useRef<Konva.Text>(null);
    const trRef = useRef<Konva.Transformer>(null);

    useEffect(() => {
        if (isSelected && trRef.current && shapeRef.current) {
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer()?.batchDraw();
        }
    }, [isSelected]);

    return (
        <React.Fragment>
            <KonvaText
                onClick={onSelect}
                onTap={onSelect}
                ref={shapeRef}
                {...shapeProps}
                draggable
                onDragEnd={(e) => {
                    onChange(shapeProps.id, {
                        ...shapeProps,
                        x: e.target.x(),
                        y: e.target.y(),
                    });
                }}
                onTransformEnd={(e) => {
                    const node = shapeRef.current;
                    if (!node) return;
                    // Text scale is slightly different, we might want to just handle it normally via transformer scale
                    onChange(shapeProps.id, {
                        ...shapeProps,
                        x: node.x(),
                        y: node.y(),
                        scaleX: node.scaleX(),
                        scaleY: node.scaleY(),
                        rotation: node.rotation(),
                    });
                }}
            />
            {isSelected && (
                <Transformer
                    ref={trRef}
                    boundBoxFunc={(oldBox, newBox) => {
                        if (newBox.width < 5 || newBox.height < 5) return oldBox;
                        return newBox;
                    }}
                />
            )}
        </React.Fragment>
    );
};

// ----- Main Editor Component -----
export default function ImageEditor() {
    const { editorImage } = useStore();
    const [bgImage] = useImage(editorImage || '', 'anonymous');

    const [shapes, setShapes] = useState<ShapeObj[]>([]);
    const [eraseLines, setEraseLines] = useState<EraseLineObj[]>([]);
    const [selectedId, selectShape] = useState<string | null>(null);
    const [toolData, setToolData] = useState<ToolMode>('select');
    const [eraserSettings, setEraserSettings] = useState({ size: 20 });

    // History states if we want to implement undo/redo later
    // const [history, setHistory] = useState<any[]>([]);

    const stageRef = useRef<Konva.Stage>(null);
    const isDrawing = useRef(false);

    const [inputText, setInputText] = useState('Teks custom');

    const checkDeselect = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
        const clickedOnEmpty = e.target === e.target.getStage();
        const clickedOnBg = e.target.name() === 'background';
        if (clickedOnEmpty || clickedOnBg) {
            selectShape(null);
        }
    };

    const handleMouseDown = (e: any) => {
        if (toolData !== 'erase') {
            checkDeselect(e);
            return;
        }

        // Eraser Tool handling
        selectShape(null);
        isDrawing.current = true;
        const pos = e.target.getStage().getPointerPosition();
        if (!pos) return;
        setEraseLines([...eraseLines, { id: Date.now().toString(), points: [pos.x, pos.y], strokeWidth: eraserSettings.size }]);
    };

    const handleMouseMove = (e: any) => {
        if (!isDrawing.current || toolData !== 'erase') return;

        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        if (!point) return;

        setEraseLines((lines) => {
            const lastLine = lines[lines.length - 1];
            if (!lastLine) return lines;

            const newLine = {
                ...lastLine,
                points: lastLine.points.concat([point.x, point.y]),
            };

            const copy = [...lines];
            copy.splice(lines.length - 1, 1, newLine);
            return copy;
        });
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
    };

    const handleAddText = () => {
        setShapes([
            ...shapes,
            {
                id: Date.now().toString(),
                type: 'text',
                x: 100,
                y: 100,
                text: inputText,
                fontSize: 40,
                fill: '#ffffff',
                rotation: 0,
                scaleX: 1,
                scaleY: 1,
            },
        ]);
        setToolData('select');
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            if (ev.target?.result) {
                setShapes([
                    ...shapes,
                    {
                        id: Date.now().toString(),
                        type: 'image',
                        x: 50,
                        y: 50,
                        src: ev.target.result as string,
                        rotation: 0,
                        scaleX: 1,
                        scaleY: 1,
                    },
                ]);
                setToolData('select');
            }
        };
        reader.readAsDataURL(file);
    };

    const handleShapeChange = (id: string, newProps: Partial<ShapeObj>) => {
        setShapes(shapes.map((s) => (s.id === id ? { ...s, ...newProps } : s)));
    };

    const handleDeleteSelected = () => {
        if (selectedId) {
            setShapes(shapes.filter((s) => s.id !== selectedId));
            selectShape(null);
        }
    };

    const handleExport = () => {
        if (!stageRef.current) return;
        // Export highly crisp image
        const uri = stageRef.current.toDataURL({ pixelRatio: 3, mimeType: 'image/png' });
        const link = document.createElement('a');
        link.download = 'veroz-edited.png';
        link.href = uri;
        link.click();
    };

    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 600;

    return (
        <div className="flex h-[75vh] w-full flex-col md:flex-row overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b0b1a]">
            {/* Toolbar Sidebar */}
            <div className="w-full shrink-0 border-b border-white/[0.08] bg-white/[0.02] p-4 md:w-64 md:border-b-0 md:border-r">
                <h3 className="mb-4 text-sm font-semibold text-white/80">Alat Editor</h3>

                <div className="flex flex-col gap-4">
                    {/* Tool Modes */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setToolData('select')}
                            className={cn('flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-sm font-medium transition-colors', toolData === 'select' ? 'bg-purple-600/50 text-purple-200' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white')}
                        >
                            <Move className="h-4 w-4" /> Pilih
                        </button>
                        <button
                            onClick={() => setToolData('erase')}
                            className={cn('flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-sm font-medium transition-colors', toolData === 'erase' ? 'bg-purple-600/50 text-purple-200' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white')}
                        >
                            <Eraser className="h-4 w-4" /> Hapus
                        </button>
                    </div>

                    {/* Eraser Settings */}
                    {toolData === 'erase' && (
                        <div className="rounded-xl border border-white/[0.05] bg-black/20 p-3">
                            <label className="mb-2 block text-xs text-slate-400">Ukuran Penghapus: {eraserSettings.size}px</label>
                            <input
                                type="range"
                                min="5"
                                max="100"
                                value={eraserSettings.size}
                                onChange={(e) => setEraserSettings({ size: Number(e.target.value) })}
                                className="w-full accent-purple-500"
                            />
                            <p className="mt-2 text-[10px] text-yellow-500/80">Catatan: Penghapus akan menghapus latar agar transparan</p>
                        </div>
                    )}

                    <hr className="border-white/[0.05]" />

                    {/* Add Elements */}
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                className="input-field flex-1 text-sm py-1.5 px-3"
                                placeholder="Teks..."
                            />
                            <button onClick={handleAddText} className="btn-secondary px-3 py-1.5" title="Tambah Teks">
                                <Type className="h-4 w-4" />
                            </button>
                        </div>
                        <label className="btn-secondary flex w-full cursor-pointer items-center justify-center gap-2 py-2 text-sm">
                            <ImageIcon className="h-4 w-4" />
                            <span>Tambah Stiker/Gambar</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>
                    </div>

                    {/* Selected Item Actions */}
                    {selectedId && (
                        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 mt-auto">
                            <p className="mb-2 text-xs text-red-200">Elemen Terpilih</p>
                            <button onClick={handleDeleteSelected} className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600/40 py-1.5 text-sm font-medium text-red-200 hover:bg-red-600/60 transition-colors">
                                <Trash2 className="h-4 w-4" /> Hapus Elemen
                            </button>
                        </div>
                    )}

                    <button onClick={handleExport} className="btn-primary mt-auto flex w-full items-center justify-center gap-2 py-3 text-sm font-semibold">
                        <Download className="h-4 w-4" /> Simpan/Unduh
                    </button>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="relative flex-1 bg-black/40 overflow-auto flex items-center justify-center p-4">
                <div className="bg-checkered shadow-2xl overflow-hidden shadow-black/50" style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}>
                    <Stage
                        width={CANVAS_WIDTH}
                        height={CANVAS_HEIGHT}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onTouchStart={handleMouseDown}
                        onTouchMove={handleMouseMove}
                        onTouchEnd={handleMouseUp}
                        ref={stageRef}
                    >
                        <Layer>
                            {/* Background Image Group with Erase functionality (GlobalCompositeOperation) */}
                            <Group>
                                {/* The main background */}
                                {bgImage && (
                                    <KonvaImage
                                        image={bgImage}
                                        name="background"
                                        width={CANVAS_WIDTH}
                                        height={CANVAS_HEIGHT}
                                    // Keep aspect ratio covering canvas. We can simplify by stretching or centering:
                                    // Let's scale down to fit inside the canvas or stretch:
                                    />
                                )}

                                {/* Erase Lines drawn on TOP of the background but set to destination-out to cut holes in it */}
                                {eraseLines.map((line) => (
                                    <Line
                                        key={line.id}
                                        points={line.points}
                                        stroke="#df4b26" // color doesn't matter for destination-out
                                        strokeWidth={line.strokeWidth}
                                        tension={0.5}
                                        lineCap="round"
                                        lineJoin="round"
                                        globalCompositeOperation="destination-out"
                                    />
                                ))}
                            </Group>

                            {/* Additional foreground shapes */}
                            {shapes.map((shape) => {
                                if (shape.type === 'text') {
                                    return (
                                        <EditableText
                                            key={shape.id}
                                            shapeProps={shape}
                                            isSelected={shape.id === selectedId}
                                            onSelect={() => selectShape(shape.id)}
                                            onChange={handleShapeChange}
                                        />
                                    );
                                }
                                if (shape.type === 'image') {
                                    return (
                                        <URLImage
                                            key={shape.id}
                                            shapeProps={shape}
                                            isSelected={shape.id === selectedId}
                                            onSelect={() => selectShape(shape.id)}
                                            onChange={handleShapeChange}
                                        />
                                    );
                                }
                                return null;
                            })}
                        </Layer>
                    </Stage>
                </div>
                {!editorImage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-10">
                        <div className="text-center p-6 bg-[#1a1a2e]/90 border border-white/10 rounded-2xl max-w-sm">
                            <h3 className="text-xl font-bold text-white mb-2">Pilih Gambar Dulu</h3>
                            <p className="text-sm text-slate-400 mb-6">Pilih gambar dari koleksi atau hasil jeneralisasi untuk diedit di sini.</p>
                            <button onClick={() => useStore.getState().setActiveTab('gallery')} className="btn-primary py-2 px-6">
                                Ke Galeri
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {/* CSS for checkered background so transparency is visible */}
            <style jsx>{`
                .bg-checkered {
                    background-color: #121212;
                    background-image: linear-gradient(45deg, #1a1a2e 25%, transparent 25%, transparent 75%, #1a1a2e 75%, #1a1a2e),
                                      linear-gradient(45deg, #1a1a2e 25%, transparent 25%, transparent 75%, #1a1a2e 75%, #1a1a2e);
                    background-size: 20px 20px;
                    background-position: 0 0, 10px 10px;
                }
            `}</style>
        </div>
    );
}

// NOTE: Since canvas has limitations with native CORS when downloading tainted canvases from external domains,
// we set anonymous crossOrigin in useImage and make sure our backend supports CORS for images.
