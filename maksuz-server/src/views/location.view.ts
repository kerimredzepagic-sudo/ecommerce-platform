import { ILocation, IWorkingHours } from "../models/Location.model";

export interface WorkingHoursDTO {
  weekdays: string;
  saturday: string;
  sunday: string;
}

export interface LocationDTO {
  id: string;
  name: string;
  subtitle?: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  workingHours: WorkingHoursDTO;
  image?: string;
  mapUrl?: string;
  features: string[];
  isHighlight: boolean;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export function toLocationDTO(location: ILocation): LocationDTO {
  return {
    id: location._id.toString(),
    name: location.name,
    subtitle: location.subtitle,
    address: location.address,
    city: location.city,
    phone: location.phone,
    email: location.email,
    workingHours: {
      weekdays: location.workingHours?.weekdays || "08:00 - 20:00",
      saturday: location.workingHours?.saturday || "08:00 - 16:00",
      sunday: location.workingHours?.sunday || "Zatvoreno",
    },
    image: location.image,
    mapUrl: location.mapUrl,
    features: location.features || [],
    isHighlight: location.isHighlight,
    isActive: location.isActive,
    order: location.order,
    createdAt: location.createdAt.toISOString(),
    updatedAt: location.updatedAt.toISOString(),
  };
}
