export type IconName =
  | "ShieldCheck"
  | "Truck"
  | "Award"
  | "Headphones";

export interface IWhyChooseFeature {
  icon: IconName;
  title: string;
  description: string;
}

export interface ICompanyIntroduction {
  title: string;
  heading: string;
  description1: string;
  description2: string;

  image: {
    url: string;
    alt: string;
  };

  buttonText: string;
  buttonLink: string;
}

export interface IWhyChooseUs {
  title: string;
  heading: string;
  items: IWhyChooseFeature[];
}

export interface ISiteContent {
  _id?: string;

  companyIntroduction: ICompanyIntroduction;

  whyChooseUs: IWhyChooseUs;

  createdAt?: string;
  updatedAt?: string;
}


export interface ISiteContentResponse {
  data : ISiteContent;
}