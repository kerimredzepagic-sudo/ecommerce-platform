"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Folder, Loader2 } from "lucide-react";
import {
  AdminHeader,
  StatusBadge,
  ConfirmDialog,
  DataTable,
} from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useBlogCategories,
  useCreateBlogCategory,
  useUpdateBlogCategory,
  useDeleteBlogCategory,
  type BlogCategory,
} from "@/hooks/useAdminApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function BlogCategoriesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(
    null
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    order: 0,
  });

  const { data: categoriesData, isLoading } = useBlogCategories();
  const createCategory = useCreateBlogCategory();
  const updateCategory = useUpdateBlogCategory();
  const deleteCategory = useDeleteBlogCategory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({
          id: editingCategory.id,
          data: formData,
        });
      } else {
        await createCategory.mutateAsync(formData);
      }
      setIsDialogOpen(false);
      setEditingCategory(null);
      setFormData({ name: "", description: "", order: 0 });
    } catch (error) {
      console.error("Greška pri spremanju kategorije:", error);
    }
  };

  const handleEdit = (category: BlogCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      order: category.order || 0,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteCategory.mutateAsync(deleteId);
        setDeleteId(null);
      } catch (error) {
        console.error("Greška pri brisanju kategorije:", error);
      }
    }
  };

  const columns = [
    {
      key: "name",
      header: "Naziv",
      render: (item: BlogCategory) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center">
            <Folder className="w-5 h-5 text-brand-orange" />
          </div>
          <div>
            <p className="font-medium text-foreground">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "description",
      header: "Opis",
      render: (item: BlogCategory) => (
        <span className="text-muted-foreground text-sm line-clamp-2">
          {item.description || "-"}
        </span>
      ),
    },
    {
      key: "order",
      header: "Redoslijed",
      render: (item: BlogCategory) => (
        <span className="text-sm">{item.order}</span>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      render: (item: BlogCategory) => (
        <StatusBadge status={item.isActive ? "active" : "inactive"} />
      ),
    },
    {
      key: "actions",
      header: "",
      render: (item: BlogCategory) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => handleEdit(item)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => setDeleteId(item.id)}
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
        title="Kategorije bloga"
        description="Organizirajte blog članke pomoću kategorija"
        showBack
        actions={
          <Button
            onClick={() => {
              setEditingCategory(null);
              setFormData({ name: "", description: "", order: 0 });
              setIsDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Dodaj kategoriju
          </Button>
        }
      />

      <div className="flex-1 p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
          </div>
        ) : categoriesData?.data && categoriesData.data.length > 0 ? (
          <DataTable columns={columns} data={categoriesData.data} />
        ) : (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Folder className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Nema kategorija</h3>
            <p className="text-muted-foreground mb-4">
              Kreirajte prvu kategoriju za organizaciju blog članaka.
            </p>
            <Button
              onClick={() => {
                setEditingCategory(null);
                setFormData({ name: "", description: "", order: 0 });
                setIsDialogOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Dodaj kategoriju
            </Button>
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Uredi kategoriju" : "Nova kategorija"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Naziv *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Naziv kategorije"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Opis</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Opis kategorije"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="order">Redoslijed</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                Manji broj = viši prioritet u prikazu
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Odustani
              </Button>
              <Button
                type="submit"
                disabled={createCategory.isPending || updateCategory.isPending}
              >
                {createCategory.isPending || updateCategory.isPending
                  ? "Spremanje..."
                  : "Spremi"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Obriši kategoriju"
        description="Jeste li sigurni da želite obrisati ovu kategoriju? Kategorije s člancima se ne mogu obrisati."
        confirmText="Obriši"
        variant="danger"
        loading={deleteCategory.isPending}
      />
    </div>
  );
}
