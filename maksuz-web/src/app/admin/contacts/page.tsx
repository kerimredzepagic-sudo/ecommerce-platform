"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, MailOpen, MessageSquare, Trash2, Eye } from "lucide-react";
import { AdminHeader, DataTable, StatusBadge, ConfirmDialog } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { useContacts, useDeleteContact, type Contact } from "@/hooks/useAdminApi";

const statusFilters = [
  { value: "", label: "Sve poruke" },
  { value: "new", label: "Nove" },
  { value: "read", label: "Pročitane" },
  { value: "replied", label: "Odgovorene" },
  { value: "archived", label: "Arhivirane" },
];

export default function ContactsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useContacts({
    page,
    limit: 10,
    status: status || undefined,
  });
  const deleteContact = useDeleteContact();

  const handleDelete = async () => {
    if (deleteId) {
      await deleteContact.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const columns = [
    {
      key: "status",
      header: "",
      className: "w-10",
      render: (contact: Contact) => (
        <div className="flex items-center justify-center">
          {contact.status === "new" ? (
            <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center">
              <Mail className="w-4 h-4 text-sky-500" />
            </div>
          ) : contact.status === "replied" ? (
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-emerald-500" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <MailOpen className="w-4 h-4 text-muted-foreground" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "sender",
      header: "Pošiljalac",
      render: (contact: Contact) => (
        <div>
          <p
            className={`font-medium ${
              contact.status === "new" ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {contact.name}
          </p>
          <p className="text-xs text-muted-foreground">{contact.email}</p>
        </div>
      ),
    },
    {
      key: "subject",
      header: "Predmet",
      render: (contact: Contact) => (
        <div>
          <p
            className={`${
              contact.status === "new"
                ? "font-semibold text-foreground"
                : "text-muted-foreground"
            }`}
          >
            {contact.subject}
          </p>
          <p className="text-xs text-muted-foreground line-clamp-1">{contact.message}</p>
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Datum",
      render: (contact: Contact) => (
        <span className="text-muted-foreground text-sm">
          {new Date(contact.createdAt).toLocaleDateString("bs-BA")}
        </span>
      ),
    },
    {
      key: "statusBadge",
      header: "Status",
      render: (contact: Contact) => <StatusBadge status={contact.status} />,
    },
    {
      key: "actions",
      header: "",
      className: "text-right",
      render: (contact: Contact) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/contacts/${contact.id}`);
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteId(contact.id);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Poruke"
        description="Upravljajte porukama s kontakt forme"
      />

      <div className="flex-1 p-6">
        {/* Status Filters */}
        <div className="mb-6 flex items-center gap-2 flex-wrap">
          {statusFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={status === filter.value ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setStatus(filter.value);
                setPage(1);
              }}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Table */}
        <DataTable
          data={data?.data || []}
          columns={columns}
          loading={isLoading}
          onRowClick={(contact) => router.push(`/admin/contacts/${contact.id}`)}
          pagination={
            data?.meta
              ? {
                  page: data.meta.page,
                  limit: data.meta.limit,
                  total: data.meta.total,
                  totalPages: data.meta.totalPages,
                  onPageChange: setPage,
                }
              : undefined
          }
          emptyMessage="Nema poruka u pretincu"
        />
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Obriši poruku"
        description="Jeste li sigurni da želite obrisati ovu poruku? Ova akcija se ne može poništiti."
        confirmText="Obriši"
        variant="danger"
        loading={deleteContact.isPending}
      />
    </div>
  );
}
