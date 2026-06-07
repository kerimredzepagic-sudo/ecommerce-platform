import { ISlide } from "../models/Slide.model";

export interface SlideDTO {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  headTitle?: string;
  backgroundType: "image" | "video";
  backgroundUrl: string;
  buttonPrimaryText?: string;
  buttonPrimaryLink?: string;
  buttonSecondaryText?: string;
  buttonSecondaryLink?: string;
  order: number;
  isActive: boolean;
  location: "shop" | "corporate";
  createdAt: string;
  updatedAt: string;
}

export function toSlideDTO(slide: ISlide): SlideDTO {
  return {
    id: slide._id.toString(),
    title: slide.title,
    subtitle: slide.subtitle,
    description: slide.description,
    headTitle: slide.headTitle,
    backgroundType: slide.backgroundType,
    backgroundUrl: slide.backgroundUrl,
    buttonPrimaryText: slide.buttonPrimaryText,
    buttonPrimaryLink: slide.buttonPrimaryLink,
    buttonSecondaryText: slide.buttonSecondaryText,
    buttonSecondaryLink: slide.buttonSecondaryLink,
    order: slide.order,
    isActive: slide.isActive,
    location: slide.location,
    createdAt: slide.createdAt.toISOString(),
    updatedAt: slide.updatedAt.toISOString(),
  };
}

