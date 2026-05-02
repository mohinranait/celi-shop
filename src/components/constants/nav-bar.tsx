import {
  Ambulance,
  Car,
  CarFront,
  Cross,
  PlaneTakeoff,
  LayoutDashboard,
  Package,
  LucideIcon,
  Settings,
  Image,
  Notebook,
  NotebookPen,
  Bolt,
  GitPullRequest,
} from "lucide-react";

export interface SidebarNavItem {
  title: string;
  url?: string;
  icon?: LucideIcon;
  badge?: string;
  items?: SidebarNavItem[];
}

// Navigation group interface
export interface SidebarNavGroup {
  title: string;
  items: SidebarNavItem[];
}

// User interface
export interface SidebarUser {
  name: string;
  email: string;
  avatar: string;
}

// Team interface
export interface SidebarTeam {
  name: string;
  logo: LucideIcon;
  plan: string;
}

// Main sidebar data interface
export interface SidebarData {
  navGroups: SidebarNavGroup[];
}

export const ambulanceTypes = [
  {
    _id: "1",
    icon: <Car className="text-primary" size={30} />,
    title: "Ac ambulance service",
    content:
      "The Ac Ambulance is the best to transport a patient a place to another. It is all Districts are available.",
    url: "/ac-ambulance-service",
  },
  {
    _id: "2",
    icon: <Ambulance className="text-primary" size={30} />,
    title: "Non-Ac Ambulance service",
    content:
      "Non-Ac Ambulance is Normal then Ac Ambulacne. it is low price then Ac Ambulance. 24/7 Ambulance is Available.",
    url: "/non-ac-ambulance",
  },
  {
    _id: "3",
    icon: <CarFront className="text-primary" size={30} />,
    title: "Basic Life Support (BLS) Ambulances",
    content:
      "Basic Life Support ambulances are a crucial part of emergency medical services, providing essential care.",
    url: "/icu-ambulance-service",
  },
  {
    _id: "4",
    icon: <Cross className="text-primary" size={30} />,
    title: "Advanced Life Support (ALS) Ambulances",
    content:
      "ALS ambulances are equipped to provide a wider range of medical procedures than BLS ambulances",
    url: "/",
  },
  {
    _id: "5",
    icon: <PlaneTakeoff className="text-primary" size={30} />,
    title: "Freezing Ambulance service",
    content:
      "It is the best way to save or carry the dead body. It has a frozen box. Use this save the dead body.",
    url: "/freezing-ambulance-service",
  },
  {
    _id: "6",
    icon: <Cross className="text-primary" size={30} />,
    title: "Hiace Microbus Service",
    content:
      "Hi-ace Microbus car is available. We provide only Hiace car from Dhaka to all districts.",
    url: "/",
  },
];

export const sidebarData: SidebarData = {
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: "/admin",
          icon: LayoutDashboard,
        },

        {
          title: "Manage Product",
          icon: Package,
          items: [
            {
              title: "All Products",
              url: "/admin/products",
            },
            {
              title: "New Product",
              url: "/admin/products/form",
            },
             {
              title: "Categories",
              url: "/admin/categories",
            },
            {
              title: "Brands",
              url: "/admin/brands",
            },
            {
              title: "Comments",
              url: "/admin/comments",
            },
          ],
        },
        {
          title: "Money Receipt",
          icon: Notebook,
          items: [
            {
              title: "New Receipt",
              url: "/admin/receipt/new",
            },
            {
              title: "All posts",
              url: "/admin/receipt/all",
            },
          ],
        },
        {
          title: "Media",
          url: "/admin/media",
          icon: Image,
        },
        {
          title: "Setting",
          url: "/admin/setting",
          icon: Settings,
        },
        {
          title: "Leads",
          url: "/admin/lead",
          icon: NotebookPen,
        },
         {
          title: "FAQ",
          url: "/admin/faq",
          icon: GitPullRequest,
        },
         {
          title: "Configurations",
          url: "/admin/configure",
          icon: Bolt,
        },
      ],
    },
  ],
};


export interface IDistrict {
  _id: string;
  name: string;
  value: string;
}

export const districts: IDistrict[] = [
  { _id: "1", name: "Bagerhat", value: "bagerhat" },
  { _id: "2", name: "Bandarban", value: "bandarban" },
  { _id: "3", name: "Barguna", value: "barguna" },
  { _id: "4", name: "Barisal", value: "barisal" },
  { _id: "5", name: "Bhola", value: "bhola" },
  { _id: "6", name: "Bogura", value: "bogura" },
  { _id: "7", name: "Brahmanbaria", value: "brahmanbaria" },
  { _id: "8", name: "Chandpur", value: "chandpur" },
  { _id: "9", name: "Chapainawabganj", value: "chapainawabganj" },
  { _id: "10", name: "Chattogram", value: "chattogram" },
  { _id: "11", name: "Chuadanga", value: "chuadanga" },
  { _id: "12", name: "Cox’s Bazar", value: "coxs-bazar" },
  { _id: "13", name: "Cumilla", value: "cumilla" },
  { _id: "14", name: "Dhaka", value: "dhaka" },
  { _id: "15", name: "Dinajpur", value: "dinajpur" },
  { _id: "16", name: "Faridpur", value: "faridpur" },
  { _id: "17", name: "Feni", value: "feni" },
  { _id: "18", name: "Gaibandha", value: "gaibandha" },
  { _id: "19", name: "Gazipur", value: "gazipur" },
  { _id: "20", name: "Gopalganj", value: "gopalganj" },
  { _id: "21", name: "Habiganj", value: "habiganj" },
  { _id: "22", name: "Jamalpur", value: "jamalpur" },
  { _id: "23", name: "Jashore", value: "jashore" },
  { _id: "24", name: "Jhalokathi", value: "jhalokathi" },
  { _id: "25", name: "Jhenaidah", value: "jhenaidah" },
  { _id: "26", name: "Joypurhat", value: "joypurhat" },
  { _id: "27", name: "Khagrachari", value: "khagrachari" },
  { _id: "28", name: "Khulna", value: "khulna" },
  { _id: "29", name: "Kishoreganj", value: "kishoreganj" },
  { _id: "30", name: "Kurigram", value: "kurigram" },
  { _id: "31", name: "Kushtia", value: "kushtia" },
  { _id: "32", name: "Lakshmipur", value: "lakshmipur" },
  { _id: "33", name: "Lalmonirhat", value: "lalmonirhat" },
  { _id: "34", name: "Madaripur", value: "madaripur" },
  { _id: "35", name: "Magura", value: "magura" },
  { _id: "36", name: "Manikganj", value: "manikganj" },
  { _id: "37", name: "Meherpur", value: "meherpur" },
  { _id: "38", name: "Moulvibazar", value: "moulvibazar" },
  { _id: "39", name: "Munshiganj", value: "munshiganj" },
  { _id: "40", name: "Mymensingh", value: "mymensingh" },
  { _id: "41", name: "Naogaon", value: "naogaon" },
  { _id: "42", name: "Narail", value: "narail" },
  { _id: "43", name: "Narayanganj", value: "narayanganj" },
  { _id: "44", name: "Narsingdi", value: "narsingdi" },
  { _id: "45", name: "Natore", value: "natore" },
  { _id: "46", name: "Netrokona", value: "netrokona" },
  { _id: "47", name: "Nilphamari", value: "nilphamari" },
  { _id: "48", name: "Noakhali", value: "noakhali" },
  { _id: "49", name: "Pabna", value: "pabna" },
  { _id: "50", name: "Panchagarh", value: "panchagarh" },
  { _id: "51", name: "Patuakhali", value: "patuakhali" },
  { _id: "52", name: "Pirojpur", value: "pirojpur" },
  { _id: "53", name: "Rajbari", value: "rajbari" },
  { _id: "54", name: "Rajshahi", value: "rajshahi" },
  { _id: "55", name: "Rangamati", value: "rangamati" },
  { _id: "56", name: "Rangpur", value: "rangpur" },
  { _id: "57", name: "Satkhira", value: "satkhira" },
  { _id: "58", name: "Shariatpur", value: "shariatpur" },
  { _id: "59", name: "Sherpur", value: "sherpur" },
  { _id: "60", name: "Sirajganj", value: "sirajganj" },
  { _id: "61", name: "Sunamganj", value: "sunamganj" },
  { _id: "62", name: "Sylhet", value: "sylhet" },
  { _id: "63", name: "Tangail", value: "tangail" },
  { _id: "64", name: "Thakurgaon", value: "thakurgaon" }
];
