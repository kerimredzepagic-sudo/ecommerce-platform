"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, ExternalLink, MapPin, Briefcase, Star, Clock } from "lucide-react";
import { AdminHeader, DataTable, StatusBadge, ConfirmDialog } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCareers, useDeleteCareer, type Career } from "@/hooks/useAdminApi";

const employmentTypeLabels: Record<string, string> = {
  "full-time": "Puno radno vrijeme",
  "part-time": "Pola radnog vremena",
  "contract": "Ugovor",
  "internship": "Praksa",
};

export default function CareersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useCareers({ page, limit: 10, search: search || undefined });
  const deleteCareer = useDeleteCareer();

  const handleDelete = async () => {
    if (deleteId) {
      await deleteCareer.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const columns = [
    {
      key: "title",
      header: "Pozicija",
      render: (career: Career) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-5 h-5 text-brand-orange" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-foreground">{career.title}</p>
              {career.isFeatured && (
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              )}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1">{career.shortDescription}</p>
          </div>
        </div>
      ),
    },
    {
      key: "department",
      header: "Odjel",
      render: (career: Career) => (
        <span className="text-muted-foreground text-sm">{career.department}</span>
      ),
    },
    {
      key: "location",
      header: "Lokacija",
      render: (career: Career) => (
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          <MapPin className="w-3 h-3" />
          <span>{career.location}</span>
        </div>
      ),
    },
    {
      key: "employmentType",
      header: "Tip",
      render: (career: Career) => (
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          <Clock className="w-3 h-3" />
          <span>{employmentTypeLabels[career.employmentType] || career.employmentType}</span>
        </div>
      ),
    },
    {
      key: "views",
      header: "Pregledi",
      render: (career: Career) => (
        <span className="text-muted-foreground">{career.views}</span>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      render: (career: Career) => {
        if (career.expiresAt && new Date(career.expiresAt) < new Date()) {
          return <StatusBadge status="expired" />;
        }
        if (career.isActive) {
          return <StatusBadge status="active" />;
        }
        return <StatusBadge status="draft" />;
      },
    },
    {
      key: "actions",
      header: "Akcije",
      className: "text-right",
      render: (career: Career) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              window.open(`/karijera/${career.slug}`, "_blank");
            }}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/careers/${career.id}`);
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteId(career.id);
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
        title="Karijera"
        description="Upravljajte oglasima za posao i otvorenim pozicijama"
        actions={
          <Button onClick={() => router.push("/admin/careers/new")}>
            <Plus className="w-4 h-4 mr-2" />
            Nova pozicija
          </Button>
        }
      />

      <div className="flex-1 p-6">
        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Pretraži pozicije..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-sm"
          />
        </div>

        {/* Table */}
        <DataTable
          data={data?.data || []}
          columns={columns}
          loading={isLoading}
          onRowClick={(career) => router.push(`/admin/careers/${career.id}`)}
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
          emptyMessage="Nema pronađenih pozicija. Kreirajte prvu poziciju!"
        />
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Obriši poziciju"
        description="Jeste li sigurni da želite obrisati ovu poziciju? Ova akcija se ne može poništiti."
        confirmText="Obriši"
        variant="danger"
        loading={deleteCareer.isPending}
      />
    </div>
  );
}
