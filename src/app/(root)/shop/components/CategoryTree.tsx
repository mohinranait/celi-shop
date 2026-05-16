import { cn } from "@/lib/utils";
import { ICategory } from "@/redux/service/categories/type";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
interface CategoryNodeProps {
  node: ICategory;
  all: ICategory[];
  activeCat: string;
  setActiveCat: (id: string) => void;
}

function isDescendantActive(id: string, all: ICategory[], activeCat: string): boolean {
  if (activeCat === id) return true;
  return all.filter((c) => c.parentId === id).some((c) => isDescendantActive(c._id, all, activeCat));
}


function CategoryNode({ node, all, activeCat, setActiveCat }: CategoryNodeProps) {
  const children = all.filter((c) => c.parentId === node._id);
  const hasKids = children.length > 0;
  const isActive = activeCat === node._id;
  const [open, setOpen] = useState(() => isDescendantActive(node._id, all, activeCat));

  return (
    <div>
      <div className="flex items-center gap-0.5">
        {/* Arrow — শুধু accordion */}
        <button
          onClick={() => hasKids && setOpen((p) => !p)}
          className={cn(
            'p-1 rounded transition-colors shrink-0',
            hasKids ? 'hover:bg-muted cursor-pointer' : 'opacity-0 pointer-events-none'
          )}
        >
          <ChevronRight
            className={cn(
              'w-3.5 h-3.5 text-muted-foreground transition-transform duration-200',
              open && 'rotate-90'
            )}
          />
        </button>

        {/* Label — শুধু category select */}
        <button
          onClick={() => setActiveCat(isActive ? '' : node._id)}
          className={cn(
            'flex-1 text-left justify-between  px-2 py-1.5 rounded-lg transition-colors text-sm',
            isActive
              ? 'bg-primary/10 text-primary font-medium'
              : 'text-foreground hover:bg-muted'
          )}
        >
          {node.name} <span className="text-sm text-muted-foreground">({node?.totalProducts})</span>
        </button>
      </div>

      {/* Children */}
      {hasKids && open && (
        <div className="ml-5 pl-2.5 border-l border-border mt-0.5 space-y-0.5">
          {children.map((child) => (
            <CategoryNode
              key={child._id}
              node={child}
              all={all}
              activeCat={activeCat}
              setActiveCat={setActiveCat}
            />
          ))}
        </div>
      )}
    </div>
  );
}


export function CategoryTree({
  categories,
  activeCat,
  setActiveCat,
}: {
  categories: ICategory[];
  activeCat: string;
  setActiveCat: (id: string) => void;
}) {
  const roots = categories.filter((c) => c.parentId === null);

  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">
        Categories
      </p>
      <div className="space-y-0.5">
        {/* All products */}
        <div className="flex items-center gap-0.5">
          <span className="w-6 shrink-0" />
          <button
            onClick={() => setActiveCat('')}
            className={cn(
              'flex-1 text-left px-2 py-1.5 rounded-lg transition-colors text-sm',
              !activeCat
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-foreground hover:bg-muted'
            )}
          >
            All products
          </button>
        </div>

        {roots.map((root) => (
          <CategoryNode
            key={root._id}
            node={root}
            all={categories}
            activeCat={activeCat}
            setActiveCat={setActiveCat}
          />
        ))}
      </div>
    </div>
  );
}
