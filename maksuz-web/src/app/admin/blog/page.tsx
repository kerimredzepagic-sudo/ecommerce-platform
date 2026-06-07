"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, ExternalLink, Folder, Clock, Star } from "lucide-react";
import { AdminHeader, DataTable, StatusBadge, ConfirmDialog } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBlogPosts, useDeleteBlogPost, type BlogPost } from "@/hooks/useAdminApi";

export default function BlogPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useBlogPosts({ page, limit: 10, search: search || undefined });
  const deleteBlogPost = useDeleteBlogPost();

  const handleDelete = async () => {
    if (deleteId) {
      await deleteBlogPost.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const columns = [
    {
      key: "title",
      header: "Članak",
      render: (post: BlogPost) => (
        <div className="flex items-center gap-3">
          <div className="w-14 h-10 bg-muted rounded-lg overflow-hidden flex-shrink-0 border border-border">
            {post.coverImage ? (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px]">
                Bez slike
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-foreground">{post.title}</p>
              {post.isFeatured && (
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              )}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1">{post.excerpt}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Kategorija",
      render: (post: BlogPost) => (
        <span className="text-muted-foreground text-sm">
          {post.category?.name || "-"}
        </span>
      ),
    },
    {
      key: "readingTime",
      header: "Čitanje",
      render: (post: BlogPost) => (
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          <Clock className="w-3 h-3" />
          <span>{post.readingTime || 1} min</span>
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Datum",
      render: (post: BlogPost) => {
        const publishedDate = post.publishedAt ? new Date(post.publishedAt) : null;
        const createdDate = post.createdAt ? new Date(post.createdAt) : null;
        const scheduledDate = post.scheduledAt ? new Date(post.scheduledAt) : null;
        
        return (
          <div className="text-sm">
            <p className="text-muted-foreground">
              {publishedDate && !isNaN(publishedDate.getTime())
                ? publishedDate.toLocaleDateString("bs-BA")
                : createdDate && !isNaN(createdDate.getTime())
                ? createdDate.toLocaleDateString("bs-BA")
                : "N/A"}
            </p>
            {scheduledDate && !post.isPublished && !isNaN(scheduledDate.getTime()) && (
              <p className="text-xs text-brand-orange">
                Zakazano: {scheduledDate.toLocaleDateString("bs-BA")}
              </p>
            )}
          </div>
        );
      },
    },
    {
      key: "views",
      header: "Pregledi",
      render: (post: BlogPost) => (
        <span className="text-muted-foreground">{post.views}</span>
      ),
    },
    {
      key: "isPublished",
      header: "Status",
      render: (post: BlogPost) => {
        if (post.isPublished) {
          return <StatusBadge status="published" />;
        } else if (post.scheduledAt) {
          return <StatusBadge status="scheduled" />;
        }
        return <StatusBadge status="draft" />;
      },
    },
    {
      key: "actions",
      header: "Akcije",
      className: "text-right",
      render: (post: BlogPost) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              window.open(`/blog/${post.slug}`, "_blank");
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
              router.push(`/admin/blog/${post.id}`);
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
              setDeleteId(post.id);
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
        title="Blog objave"
        description="Upravljajte člancima i objavama na blogu"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/blog/categories")}
            >
              <Folder className="w-4 h-4 mr-2" />
              Kategorije
            </Button>
            <Button onClick={() => router.push("/admin/blog/new")}>
              <Plus className="w-4 h-4 mr-2" />
              Novi članak
            </Button>
          </div>
        }
      />

      <div className="flex-1 p-6">
        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Pretraži članke..."
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
          onRowClick={(post) => router.push(`/admin/blog/${post.id}`)}
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
          emptyMessage="Nema pronađenih članaka. Napišite prvi članak!"
        />
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Obriši članak"
        description="Jeste li sigurni da želite obrisati ovaj članak? Ova akcija se ne može poništiti."
        confirmText="Obriši"
        variant="danger"
        loading={deleteBlogPost.isPending}
      />
    </div>
  );
}
