"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Laptop,
  Shirt,
  Home,
  Sparkles,
  Dumbbell,
  BookOpen,
  Salad,
  Baby,
  Smartphone,
  Headphones,
  Tv,
  Camera,
  Tablet,
  Plug,
  Printer,
  Footprints,
  Backpack,
  Watch,
  Glasses,
  Gem,
  Sofa,
  BedDouble,
  UtensilsCrossed,
  Lamp,
  Leaf,
  Bath,
  WashingMachine,
  Brush,
  Droplets,
  HeartPulse,
  PillBottle,
  Scissors,
  Palette,
  Zap,
  ShoppingCart,
  Heart,
  User,
  Search,
  Truck,
  Headset,
  ChevronRight,
  Flame,
  Star,
  Tag,
  Fish,
  Apple,
  Coffee,
  Cookie,
  Milk,
  Wheat,
  Puzzle,
  Gamepad,
  GraduationCap,
  Trophy,
  Bike,
  Tent,
  Trees,
  Settings,
  Menu,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SubCategory {
  name: string;
  count: string;
  icon: React.ReactNode;
}

interface CategoryItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  banner: { eyebrow: string; title: string; cta: string };
  subcategories: SubCategory[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const categories: CategoryItem[] = [
  {
    id: "electronics",
    label: "ইলেকট্রনিক্স",
    icon: <Laptop size={17} />,
    banner: {
      eyebrow: "সীমিত সময়ের অফার",
      title: "ইলেকট্রনিক্সে ৩০% পর্যন্ত ছাড়",
      cta: "অফার দেখুন",
    },
    subcategories: [
      { name: "স্মার্টফোন", count: "১,২৪০ পণ্য", icon: <Smartphone size={20} /> },
      { name: "ল্যাপটপ", count: "৮৬০ পণ্য", icon: <Laptop size={20} /> },
      { name: "হেডফোন", count: "৫৪০ পণ্য", icon: <Headphones size={20} /> },
      { name: "টেলিভিশন", count: "৩২০ পণ্য", icon: <Tv size={20} /> },
      { name: "ক্যামেরা", count: "৪১০ পণ্য", icon: <Camera size={20} /> },
      { name: "ট্যাবলেট", count: "২৮০ পণ্য", icon: <Tablet size={20} /> },
      { name: "অ্যাকসেসরিজ", count: "২,১০০ পণ্য", icon: <Plug size={20} /> },
      { name: "প্রিন্টার", count: "১৫০ পণ্য", icon: <Printer size={20} /> },
    ],
  },
  {
    id: "fashion",
    label: "ফ্যাশন ও পোশাক",
    icon: <Shirt size={17} />,
    banner: {
      eyebrow: "নতুন কালেকশন",
      title: "ঈদ স্পেশাল ফ্যাশন সেল",
      cta: "শপ করুন",
    },
    subcategories: [
      { name: "পুরুষ পোশাক", count: "৩,৪০০ পণ্য", icon: <Shirt size={20} /> },
      { name: "মহিলা পোশাক", count: "৫,১০০ পণ্য", icon: <Shirt size={20} /> },
      { name: "জুতা ও স্যান্ডেল", count: "১,৮৬০ পণ্য", icon: <Footprints size={20} /> },
      { name: "ব্যাগ", count: "৯৪০ পণ্য", icon: <Backpack size={20} /> },
      { name: "ঘড়ি", count: "৬২০ পণ্য", icon: <Watch size={20} /> },
      { name: "সানগ্লাস", count: "৩৮০ পণ্য", icon: <Glasses size={20} /> },
      { name: "গহনা", count: "২,২০০ পণ্য", icon: <Gem size={20} /> },
      { name: "শীতবস্ত্র", count: "৭৪০ পণ্য", icon: <Shirt size={20} /> },
    ],
  },
  {
    id: "home",
    label: "হোম ও লিভিং",
    icon: <Home size={17} />,
    banner: {
      eyebrow: "হোম মেকওভার",
      title: "ফার্নিচারে বিশেষ ছাড় চলছে",
      cta: "দেখুন",
    },
    subcategories: [
      { name: "ফার্নিচার", count: "১,৬০০ পণ্য", icon: <Sofa size={20} /> },
      { name: "বেডিং", count: "৮৮০ পণ্য", icon: <BedDouble size={20} /> },
      { name: "কিচেন", count: "২,৪০০ পণ্য", icon: <UtensilsCrossed size={20} /> },
      { name: "লাইটিং", count: "৫৬০ পণ্য", icon: <Lamp size={20} /> },
      { name: "গার্ডেনিং", count: "৪২০ পণ্য", icon: <Leaf size={20} /> },
      { name: "বাথরুম", count: "৭১০ পণ্য", icon: <Bath size={20} /> },
      { name: "হোম অ্যাপ্লায়েন্স", count: "৯৩০ পণ্য", icon: <WashingMachine size={20} /> },
      { name: "ডেকোর", count: "১,১৫০ পণ্য", icon: <Brush size={20} /> },
    ],
  },
  {
    id: "beauty",
    label: "বিউটি ও হেলথ",
    icon: <Sparkles size={17} />,
    banner: {
      eyebrow: "বিউটি বাংলাদেশ",
      title: "অথেনটিক প্রোডাক্ট গ্যারান্টি",
      cta: "অফার দেখুন",
    },
    subcategories: [
      { name: "স্কিনকেয়ার", count: "২,৮০০ পণ্য", icon: <Settings size={20} /> },
      { name: "পারফিউম", count: "৬৪০ পণ্য", icon: <Droplets size={20} /> },
      { name: "হেলথ কেয়ার", count: "১,৩৪০ পণ্য", icon: <HeartPulse size={20} /> },
      { name: "ভিটামিন", count: "৪৮০ পণ্য", icon: <PillBottle size={20} /> },
      { name: "হেয়ার কেয়ার", count: "৯২০ পণ্য", icon: <Scissors size={20} /> },
      { name: "মেকআপ", count: "১,৭৬০ পণ্য", icon: <Palette size={20} /> },
      { name: "ফিটনেস", count: "৫৩০ পণ্য", icon: <Dumbbell size={20} /> },
      { name: "ওরাল কেয়ার", count: "৩৮০ পণ্য", icon: <Sparkles size={20} /> },
    ],
  },
  {
    id: "sports",
    label: "স্পোর্টস",
    icon: <Trophy size={17} />,
    banner: {
      eyebrow: "স্পোর্টস সিজন",
      title: "ক্রিকেট গিয়ারে বিশেষ ডিসকাউন্ট",
      cta: "শপ করুন",
    },
    subcategories: [
      { name: "ফুটবল", count: "৩৪০ পণ্য", icon: <Trophy size={20} /> },
      { name: "ক্রিকেট", count: "৫৬০ পণ্য", icon: <Star size={20} /> },
      { name: "সাইকেল", count: "২৮০ পণ্য", icon: <Bike size={20} /> },
      { name: "সুইমিং", count: "১৪০ পণ্য", icon: <Droplets size={20} /> },
      { name: "জিম ইকুইপমেন্ট", count: "৪৬০ পণ্য", icon: <Dumbbell size={20} /> },
      { name: "ক্যাম্পিং", count: "৩২০ পণ্য", icon: <Tent size={20} /> },
      { name: "যোগব্যায়াম", count: "২১০ পণ্য", icon: <Trees size={20} /> },
      { name: "ব্যাডমিন্টন", count: "১৯০ পণ্য", icon: <Zap size={20} /> },
    ],
  },
  {
    id: "books",
    label: "বই ও স্টেশনারি",
    icon: <BookOpen size={17} />,
    banner: {
      eyebrow: "বই উৎসব",
      title: "যেকোনো বইয়ে ২০% ছাড়",
      cta: "কিনুন",
    },
    subcategories: [
      { name: "বাংলা সাহিত্য", count: "৪,২০০ পণ্য", icon: <BookOpen size={20} /> },
      { name: "একাডেমিক", count: "৩,৮০০ পণ্য", icon: <GraduationCap size={20} /> },
      { name: "ইংরেজি বই", count: "২,১০০ পণ্য", icon: <BookOpen size={20} /> },
      { name: "খাতা ও কলম", count: "১,৫০০ পণ্য", icon: <Brush size={20} /> },
      { name: "আর্ট সাপ্লাই", count: "৬৮০ পণ্য", icon: <Palette size={20} /> },
      { name: "শিশু বই", count: "৯৪০ পণ্য", icon: <Baby size={20} /> },
      { name: "ব্যবসায়িক বই", count: "৮৬০ পণ্য", icon: <Star size={20} /> },
      { name: "ইসলামিক বই", count: "১,৩৪০ পণ্য", icon: <BookOpen size={20} /> },
    ],
  },
  {
    id: "food",
    label: "ফুড ও গ্রোসারি",
    icon: <Salad size={17} />,
    banner: {
      eyebrow: "তাজা ডেলিভারি",
      title: "অর্গানিক ফুড কালেকশন",
      cta: "অর্ডার করুন",
    },
    subcategories: [
      { name: "চাল ও ডাল", count: "৩৪০ পণ্য", icon: <Wheat size={20} /> },
      { name: "মাছ ও মাংস", count: "২৮০ পণ্য", icon: <Fish size={20} /> },
      { name: "ফল ও সবজি", count: "৪৬০ পণ্য", icon: <Apple size={20} /> },
      { name: "চা ও কফি", count: "৫৮০ পণ্য", icon: <Coffee size={20} /> },
      { name: "স্ন্যাকস", count: "৮৪০ পণ্য", icon: <Cookie size={20} /> },
      { name: "ডেইরি পণ্য", count: "২১০ পণ্য", icon: <Milk size={20} /> },
      { name: "তেল ও মশলা", count: "৬৬০ পণ্য", icon: <Menu size={20} /> },
      { name: "মিষ্টি ও ডেজার্ট", count: "৩৮০ পণ্য", icon: <Cookie size={20} /> },
    ],
  },
  {
    id: "kids",
    label: "শিশু পণ্য",
    icon: <Baby size={17} />,
    banner: {
      eyebrow: "শিশু উৎসব",
      title: "বাচ্চাদের জন্য সেরা পণ্য",
      cta: "দেখুন",
    },
    subcategories: [
      { name: "খেলনা", count: "২,৪০০ পণ্য", icon: <Gamepad size={20} /> },
      { name: "বেবি কেয়ার", count: "১,৮৬০ পণ্য", icon: <Baby size={20} /> },
      { name: "শিশু পোশাক", count: "৩,২০০ পণ্য", icon: <Shirt size={20} /> },
      { name: "পাজল ও গেমস", count: "৫৬০ পণ্য", icon: <Puzzle size={20} /> },
      { name: "আঁকার সরঞ্জাম", count: "৪৩০ পণ্য", icon: <Palette size={20} /> },
      { name: "শিক্ষামূলক", count: "৭৮০ পণ্য", icon: <GraduationCap size={20} /> },
      { name: "শিশু খাবার", count: "৩৪০ পণ্য", icon: <Milk size={20} /> },
      { name: "স্ট্রোলার", count: "১২০ পণ্য", icon: <Baby size={20} /> },
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function TopBar() {
  return (
    <div className="bg-[#1a1a2e] text-[#a9b4c8] text-xs px-8 py-1.5 flex justify-between items-center">
      <span className="flex items-center gap-1.5">
        <Truck size={13} />
        ৳৫০০+ অর্ডারে ফ্রি ডেলিভারি{" "}
        <strong className="text-white ml-1">সারা বাংলাদেশে</strong>
      </span>
      <span className="flex items-center gap-4">
        <a href="#" className="flex items-center gap-1 hover:text-white transition-colors">
          <Headset size={12} /> সাপোর্ট
        </a>
        <a href="#" className="hover:text-white transition-colors">ট্র্যাক অর্ডার</a>
        <a href="#" className="hover:text-white transition-colors">বিক্রেতা হন</a>
        <span className="text-zinc-600">|</span>
        <a href="#" className="hover:text-white transition-colors">BDT ৳</a>
      </span>
    </div>
  );
}

function SearchBar() {
  return (
    <div className="flex-1 max-w-xl flex items-center border border-zinc-200 rounded-xl overflow-hidden bg-zinc-50 focus-within:border-[#1a1a2e] focus-within:bg-white transition-all">
      <Select defaultValue="all">
        <SelectTrigger className="h-10 w-36 border-0 border-r border-zinc-200 rounded-none bg-transparent text-xs text-zinc-500 focus:ring-0 shrink-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">সব ক্যাটাগরি</SelectItem>
          <SelectItem value="electronics">ইলেকট্রনিক্স</SelectItem>
          <SelectItem value="fashion">ফ্যাশন</SelectItem>
          <SelectItem value="home">হোম</SelectItem>
          <SelectItem value="books">বই</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="text"
        placeholder="পণ্য খুঁজুন..."
        className="flex-1 h-10 border-0 bg-transparent text-sm focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
      />
      <button
        aria-label="Search"
        className="w-11 h-10 bg-[#1a1a2e] hover:bg-[#e85d26] flex items-center justify-center text-white transition-colors shrink-0"
      >
        <Search size={16} />
      </button>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  badge?: number;
}) {
  return (
    <a
      href="#"
      className="relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg text-[10px] font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
    >
      <span className="text-[#1a1a2e]">{icon}</span>
      {label}
      {badge != null && (
        <span className="absolute top-1 right-1.5 bg-[#e85d26] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
          {badge}
        </span>
      )}
    </a>
  );
}

// ─── Mega Menu Panel ──────────────────────────────────────────────────────────

function MegaMenuPanel() {
  const [activeId, setActiveId] = useState<string>("electronics");
  const active = categories.find((c) => c.id === activeId)!;

  return (
    <div className="flex min-h-[420px]">
      {/* Sidebar */}
      <aside className="w-52 shrink-0 border-r border-zinc-100 bg-zinc-50 py-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onMouseEnter={() => setActiveId(cat.id)}
            className={cn(
              "w-full flex items-center gap-2.5 px-5 py-2.5 text-sm text-left transition-colors relative",
              activeId === cat.id
                ? "bg-white text-[#e85d26] font-medium after:absolute after:right-0 after:top-0 after:bottom-0 after:w-[3px] after:bg-[#e85d26]"
                : "text-zinc-600 hover:bg-white hover:text-[#e85d26]"
            )}
          >
            <span className="shrink-0">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </aside>

      {/* Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="flex items-center gap-2 text-[15px] font-semibold text-[#1a1a2e]">
            <span className="text-[#e85d26]">{active.icon}</span>
            {active.label}
          </h3>
          <a
            href="#"
            className="flex items-center gap-1 text-xs text-[#e85d26] font-medium hover:underline"
          >
            সব দেখুন <ChevronRight size={13} />
          </a>
        </div>

        {/* 4-column grid */}
        <div className="grid grid-cols-4 gap-3">
          {active.subcategories.map((sub) => (
            <a
              key={sub.name}
              href="#"
              className="group bg-zinc-50 border border-zinc-200 rounded-xl p-3.5 flex flex-col gap-1.5 hover:bg-white hover:border-[#e85d26] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(232,93,38,0.08)] transition-all"
            >
              <span className="w-10 h-10 rounded-lg bg-white border border-zinc-200 flex items-center justify-center text-[#1a1a2e] group-hover:bg-orange-50 group-hover:text-[#e85d26] group-hover:border-orange-100 transition-colors">
                {sub.icon}
              </span>
              <span className="text-xs font-semibold text-[#1a1a2e]">{sub.name}</span>
              <span className="text-[11px] text-zinc-400">{sub.count}</span>
            </a>
          ))}
        </div>

        {/* Banner */}
        <div className="mt-5 rounded-xl bg-[#1a1a2e] px-5 py-4 flex items-center justify-between">
          <div className="text-white">
            <p className="text-[11px] text-[#a9b4c8]">{active.banner.eyebrow}</p>
            <h4 className="text-sm font-semibold mt-0.5">{active.banner.title}</h4>
          </div>
          <span className="bg-[#e85d26] text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap cursor-pointer hover:bg-orange-500 transition-colors">
            {active.banner.cta} →
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Header ──────────────────────────────────────────────────────────────

export default function EcommerceHeader() {
  return (
    <header className="relative w-full font-sans">
      {/* Top bar */}
      <TopBar />

      {/* Main header row */}
      <div className="flex items-center justify-between px-8 h-16 gap-6 bg-white border-b border-zinc-100">
        {/* Logo */}
        <a
          href="#"
          className="flex items-center gap-2 text-[22px] font-bold text-[#1a1a2e] tracking-tight shrink-0 no-underline"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#e85d26] inline-block" />
          ShopBD
        </a>

        <SearchBar />

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <ActionButton icon={<Heart size={22} />} label="উইশলিস্ট" badge={3} />
          <ActionButton icon={<ShoppingCart size={22} />} label="কার্ট" badge={5} />
          <ActionButton icon={<User size={22} />} label="অ্যাকাউন্ট" />
        </div>
      </div>

      {/* Nav bar */}
      <nav className="flex items-stretch px-8 bg-white border-b border-zinc-100 relative z-50">
        <NavigationMenu>
          <NavigationMenuList className="gap-0">
            {/* All Categories trigger */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-11 px-4 bg-[#1a1a2e] text-white text-sm font-medium hover:bg-[#e85d26] hover:text-white data-[state=open]:bg-[#e85d26] data-[state=open]:text-white rounded-none transition-colors gap-1.5">
                <span className="grid grid-cols-2 gap-0.5 w-4 h-4 shrink-0">
                  {[...Array(4)].map((_, i) => (
                    <span key={i} className="rounded-[1px] bg-current opacity-80" />
                  ))}
                </span>
                সব ক্যাটাগরি
              </NavigationMenuTrigger>
              <NavigationMenuContent className="min-w-[800px] left-0 !rounded-none border-t-2 border-[#e85d26] shadow-xl">
                <MegaMenuPanel />
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Regular nav links */}
        <div className="flex items-stretch ml-1">
          {[
            { label: "ডিলস", icon: <Flame size={14} /> },
            { label: "নতুন পণ্য", icon: null },
            { label: "সেরা বিক্রেতা", icon: <Star size={14} /> },
            { label: "ব্র্যান্ড", icon: null },
          ].map((item) => (
            <a
              key={item.label}
              href="#"
              className="flex items-center gap-1.5 px-4 h-11 text-[13px] font-medium text-zinc-600 hover:text-[#1a1a2e] border-b-2 border-transparent hover:border-[#e85d26] transition-all"
            >
              {item.icon}
              {item.label}
            </a>
          ))}
        </div>

        {/* Promo badge */}
        <div className="ml-auto flex items-center pr-1">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-[#e85d26]">
            <Zap size={13} className="fill-[#e85d26]" />
            ফ্ল্যাশ সেল চলছে!
          </span>
        </div>
      </nav>
    </header>
  );
}