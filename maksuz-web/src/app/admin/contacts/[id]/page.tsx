"use client";

import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Mail,
  Phone,
  Calendar,
  Reply,
  Archive,
  Trash2,
} from "lucide-react";
import { AdminHeader, StatusBadge, ConfirmDialog } from "@/components/admin";
import { Button } from "@/components/ui/button";
import {
  useContact,
  useUpdateContactStatus,
  useDeleteContact,
} from "@/hooks/useAdminApi";
import { useState } from "react";

export default function ContactDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data, isLoading } = useContact(id);
  const updateStatus = useUpdateContactStatus();
  const deleteContact = useDeleteContact();

  const contact = data?.data;

  const handleDelete = async () => {
    await deleteContact.mutateAsync(id);
    router.push("/admin/contacts");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <AdminHeader title="Detalji poruke" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="flex flex-col min-h-screen">
        <AdminHeader title="Poruka nije pronađena" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Poruka nije pronađena</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Detalji poruke"
        description={`Od: ${contact.name}`}
        showBack
      />

      <div className="flex-1 p-6">
        <div className="max-w-3xl space-y-6">
          {/* Message Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {contact.subject}
                </h2>
                <StatusBadge status={contact.status} />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateStatus.mutate({ id, status: "replied" })
                  }
                  disabled={contact.status === "replied"}
                >
                  <Reply className="w-4 h-4 mr-2" />
                  Označi kao odgovoreno
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    updateStatus.mutate({ id, status: "archived" })
                  }
                  disabled={contact.status === "archived"}
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Arhiviraj
                </Button>
              </div>
            </div>

            {/* Sender Info */}
            <div className="flex flex-wrap gap-6 mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-2 text-gray-600">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-500 font-medium">
                    {contact.name[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{contact.name}</p>
                  <p className="text-sm text-gray-500">Pošiljalac</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-orange-500 hover:underline"
                  >
                    {contact.email}
                  </a>
                  <p className="text-sm text-gray-500">Email</p>
                </div>
              </div>
              {contact.phone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-orange-500 hover:underline"
                    >
                      {contact.phone}
                    </a>
                    <p className="text-sm text-gray-500">Telefon</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-gray-900">
                    {new Date(contact.createdAt).toLocaleDateString("bs-BA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-sm text-gray-500">Primljeno</p>
                </div>
              </div>
            </div>

            {/* Message Content */}
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{contact.message}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Akcije
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() =>
                  (window.location.href = `mailto:${contact.email}?subject=Re: ${contact.subject}`)
                }
              >
                <Reply className="w-4 h-4 mr-2" />
                Odgovori putem emaila
              </Button>
              <Button
                variant="outline"
                className="text-red-500 border-red-200 hover:bg-red-50"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Obriši poruku
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Obriši poruku"
        description="Jeste li sigurni da želite trajno obrisati ovu poruku? Ova akcija se ne može poništiti."
        confirmText="Obriši"
        variant="danger"
        loading={deleteContact.isPending}
      />
    </div>
  );
}
