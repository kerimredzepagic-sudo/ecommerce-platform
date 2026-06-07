import { IContact } from '../models';

export interface ContactDTO {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
  repliedAt?: string;
  createdAt: string;
}

export function toContactDTO(contact: IContact): ContactDTO {
  return {
    id: contact._id.toString(),
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    subject: contact.subject,
    message: contact.message,
    status: contact.status,
    repliedAt: contact.repliedAt?.toISOString(),
    createdAt: contact.createdAt.toISOString(),
  };
}

export function toContactDTOs(contacts: IContact[]): ContactDTO[] {
  return contacts.map(toContactDTO);
}

