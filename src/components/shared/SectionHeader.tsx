import Link from 'next/link';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface Props {
  title: string;
  description?: string;
  seeAllLink?: string;
  seeAllText?: string;
  className?: string;
}

export default function SectionHeader({
  title,
  description,
  seeAllLink = '#',
  seeAllText = 'See All',
  className
}: Props) {
  return (
    <div className={cn("max-w-7xl mx-auto px-4 py-8", className)}>
      <div className="flex flex-col items-center text-center">
        
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white tracking-tight">
          {title}
        </h2>

        {/* Description */}
        {description && (
          <p className="mt-2 text-muted-foreground text-lg max-w-2xl">
            {description}
          </p>
        )}

        {/* See All Button */}
        <Link
          href={seeAllLink}
          className="mt-2"
        >
          <Button variant={'outline'} >

          {seeAllText}
          <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}