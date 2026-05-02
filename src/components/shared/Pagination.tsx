"use client";

import { Button } from "@/components/ui/button";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: Props) {
  if (totalPages <= 1) return null;

  //  create page numbers
  const getPages = () => {
    const pages: (number | string)[] = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between px-4 ">
      
      {/* LEFT INFO */}
      <p className="text-sm text-muted-foreground">
        Page <span className="font-medium">{page}</span> of{" "}
        <span className="font-medium">{totalPages}</span>
      </p>

      {/* MIDDLE PAGES */}
      <div className="flex gap-1">
        {/* Prev */}
        <Button
          variant="outline"
          size="sm"
          className="h-9"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          Prev
        </Button>

        {/* Numbers */}
        {getPages().map((p) => (
          <Button
            key={p}
            size="sm"
            variant={page === p ? "default" : "outline"}
            onClick={() => onPageChange(Number(p))}
            className="w-9 h-9 p-0"
          >
            {p}
          </Button>
        ))}

        {/* Next */}
        <Button
          variant="outline"
          size="sm"
          className="h-9"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}