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
  seeAllLink ,
  seeAllText ,
  className
}: Props) {
  return (
    <div className={cn("max-w-7xl mx-auto px-4 ", className)}>
      <div className="flex flex-col items-center text-center">
        
        {/* Title */}
        <h2 className=" text-xl  xl:text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white tracking-tight">
          {title}
        </h2>

        {/* Description */}
        {description && (
          <p className="  lg:mt-2 text-muted-foreground text-xs lg:text-sm xl:text-lg max-w-2xl">
            {description}
          </p>
        )}

        {/* See All Button */}
        {

           seeAllLink && seeAllText  && 
        <Link
          href={seeAllLink}
          className="mt-1 md:mt-2"
        >
          <Button className='text-xs h-6 md:h-9 md:px-6' variant={'default'} >

          {seeAllText}
          <span className="group-hover:translate-x-1  transition-transform duration-300">→</span>
          </Button>
        </Link>
        }
      </div>
    </div>
  );
}