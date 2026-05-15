'use client';
import { useState, useMemo } from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ICategory } from '@/redux/service/categories/type';

// ==================== Internal Type (Safe) ====================
type InternalCategory = {
  _id: string;
  name: string;
  slug: string;
  parentId: string | null;
  children?: InternalCategory[];
  level?: number;
  path?: string[];
  thumbnail?: string;
  banner?: string;
  status?: boolean;
  description?: string;
};

// ==================== Props ====================
type Props = {
  categories: ICategory[];         
  value: string;
  onChange: (categoryId: string) => void;
  error?: string;
};

export default function NestedCategorySelector({
  categories,
  value,
  onChange,
  error,
}: Props) {

  // ==================== Convert ICategory to InternalCategory ====================
  const internalCategories = useMemo((): InternalCategory[] => {
    const map = new Map<string, InternalCategory>();
    const roots: InternalCategory[] = [];

    // First pass: Create nodes
    categories.forEach(cat => {
      const node: InternalCategory = {
        ...cat,
        parentId: cat.parentId ?? null,   // undefined → null
        children: [],
      };
      map.set(cat._id, node);
    });

    // Second pass: Build children tree
    categories.forEach(cat => {
      const node = map.get(cat._id)!;
      if (cat.parentId && map.has(cat.parentId)) {
        map.get(cat.parentId)!.children!.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }, [categories]);

  const [open, setOpen] = useState(false);
  const [hoveredLevel1, setHoveredLevel1] = useState<string | null>(null);
  const [hoveredLevel2, setHoveredLevel2] = useState<string | null>(null);

  // Get Full Path for Display
  const selectedPath = useMemo(() => {
    if (!value) return [];

    const findPath = (
      nodes: InternalCategory[],
      targetId: string,
      path: InternalCategory[] = []
    ): InternalCategory[] => {
      for (const node of nodes) {
        if (node._id === targetId) return [...path, node];
        if (node.children?.length) {
          const result = findPath(node.children, targetId, [...path, node]);
          if (result.length > path.length) return result;
        }
      }
      return [];
    };

    return findPath(internalCategories, value);
  }, [value, internalCategories]);

  const handleOpen = () => {
    setOpen(prev => !prev);
    if (value && selectedPath.length > 0) {
      setHoveredLevel1(selectedPath[0]?._id || null);
      setHoveredLevel2(selectedPath[1]?._id || null);
    } else {
      setHoveredLevel1(null);
      setHoveredLevel2(null);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setHoveredLevel1(null);
    setHoveredLevel2(null);
  };

  const level1 = internalCategories;

  const level2 = useMemo(() => {
    if (!hoveredLevel1) return [];
    const parent = internalCategories.find(c => c._id === hoveredLevel1);
    return parent?.children || [];
  }, [hoveredLevel1, internalCategories]);

  const level3 = useMemo(() => {
    if (!hoveredLevel2) return [];
    const findNode = (nodes: InternalCategory[]): InternalCategory | null => {
      for (const node of nodes) {
        if (node._id === hoveredLevel2) return node;
        if (node.children?.length) {
          const found = findNode(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    const parentNode = findNode(internalCategories);
    return parentNode?.children || [];
  }, [hoveredLevel2, internalCategories]);

  const handleSelect = (id: string) => {
    onChange(id);
    handleClose();
  };

  return (
    <div className="relative">
      <div
        onClick={handleOpen}
        className="border border-input rounded-lg px-4 py-1 cursor-pointer hover:border-primary transition flex items-center justify-between min-h-11.5 bg-background"
      >
        {selectedPath.length > 0 ? (
          <div className="flex items-center gap-1.5 flex-wrap text-sm">
            {selectedPath.map((cat, index) => (
              <span key={cat._id} className="flex items-center">
                <span className="font-medium text-foreground">{cat.name}</span>
                {index < selectedPath.length - 1 && (
                  <span className="text-muted-foreground mx-1.5">/</span>
                )}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground">Select Category...</span>
        )}

        <ChevronRight className={`transition ${open ? 'rotate-90' : ''}`} />
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

      {/* 3 Column Popup */}
      {open && (
        <div className="absolute z-50 mt-2 w-full max-w-5xl bg-white dark:bg-slate-950 border border-border rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex h-125">
            {/* Column 1 */}
            <div className="w-1/3 border-r border-border">
              <div className="p-4 font-semibold border-b bg-muted/50">Main Categories</div>
              <ScrollArea className="h-full">
                <div className="p-2">
                  {level1.map((cat) => (
                    <div
                      key={cat._id}
                      onMouseEnter={() => {
                        setHoveredLevel1(cat._id);
                        setHoveredLevel2(null);
                      }}
                      onClick={() => handleSelect(cat._id)}
                      className={`px-4 py-3.5 flex items-center justify-between rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${
                        hoveredLevel1 === cat._id ? 'bg-slate-100 dark:bg-slate-800' : ''
                      } ${value === cat._id ? 'text-primary font-medium bg-primary/5' : ''}`}
                    >
                      <span>{cat.name}</span>
                      {cat.children?.length ? <ChevronRight size={18} /> : null}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Column 2 */}
            <div className="w-1/3 border-r border-border bg-slate-50 dark:bg-slate-900">
              <div className="p-4 font-semibold border-b text-sm text-muted-foreground">
                Sub Categories
              </div>
              <ScrollArea className="h-full">
                <div className="p-2">
                  {level2.length > 0 ? (
                    level2.map((cat) => (
                      <div
                        key={cat._id}
                        onMouseEnter={() => setHoveredLevel2(cat._id)}
                        onClick={() => handleSelect(cat._id)}
                        className={`px-4 py-3.5 flex items-center justify-between rounded-xl cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-all ${
                          hoveredLevel2 === cat._id ? 'bg-white dark:bg-slate-800' : ''
                        } ${value === cat._id ? 'text-primary font-medium bg-primary/5' : ''}`}
                      >
                        <span>{cat.name}</span>
                        {cat.children?.length ? <ChevronRight size={18} /> : null}
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
                      No subcategories
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Column 3 */}
            <div className="w-1/3 bg-slate-50 dark:bg-slate-900">
              <div className="p-4 font-semibold border-b text-sm text-muted-foreground">
                More Categories
              </div>
              <ScrollArea className="h-full">
                <div className="p-2">
                  {level3.length > 0 ? (
                    level3.map((cat) => (
                      <div
                        key={cat._id}
                        onClick={() => handleSelect(cat._id)}
                        className={`px-4 py-3.5 rounded-xl cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-all ${value === cat._id ? 'bg-primary/10 text-primary font-medium' : ''}`}
                      >
                        {cat.name}
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
                      No more subcategories
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          <div className="border-t p-3 flex justify-end bg-slate-50 dark:bg-slate-900">
            <Button variant="outline" type='button' onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}