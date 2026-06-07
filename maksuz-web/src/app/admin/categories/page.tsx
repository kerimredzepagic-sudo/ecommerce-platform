"use client";

import { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  ChevronDown,
  FolderTree,
  Loader2,
  X,
  GripVertical,
  AlertTriangle,
  Tag,
  Hash,
  Calendar,
} from "lucide-react";
import { AdminHeader, StatusBadge } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  useCategoryTree,
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useReorderCategories,
  type CategoryTreeNode,
} from "@/hooks/useAdminApi";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Level colors for visual hierarchy
const levelColors = {
  1: "border-l-brand-orange",
  2: "border-l-blue-500",
  3: "border-l-emerald-500",
};

const levelBadges = {
  1: { bg: "bg-brand-orange/10", text: "text-brand-orange", label: "Glavna" },
  2: { bg: "bg-blue-50", text: "text-blue-600", label: "Podkategorija" },
  3: { bg: "bg-emerald-50", text: "text-emerald-600", label: "Nivo 3" },
};

interface DraggableCategoryRowProps {
  category: CategoryTreeNode;
  index: number;
  depth: number;
  onEdit: (category: CategoryTreeNode) => void;
  onDelete: (category: CategoryTreeNode) => void;
  onAddChild: (parentId: string, parentLevel: number) => void;
  onReorder: (parentId: string | null, orderedChildren: CategoryTreeNode[]) => void;
}

function DraggableCategoryRow({
  category,
  index,
  depth,
  onEdit,
  onDelete,
  onAddChild,
  onReorder,
}: DraggableCategoryRowProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = category.children && category.children.length > 0;
  const levelColor = levelColors[category.level as keyof typeof levelColors] || levelColors[1];
  const levelBadge = levelBadges[category.level as keyof typeof levelBadges] || levelBadges[1];
  const canAddChild = category.level < 3;

  const handleChildDragEnd = (result: DropResult) => {
    if (!result.destination || !category.children) return;
    
    const reorderedChildren = Array.from(category.children);
    const [removed] = reorderedChildren.splice(result.source.index, 1);
    reorderedChildren.splice(result.destination.index, 0, removed);
    
    onReorder(category.id, reorderedChildren);
  };

  return (
    <Draggable draggableId={category.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div
            className={cn(
              "flex items-center gap-3 py-3 px-4 bg-card border-b border-border transition-colors",
              "border-l-4",
              levelColor,
              snapshot.isDragging && "shadow-lg bg-card ring-2 ring-brand-orange/50"
            )}
            style={{ paddingLeft: `${depth * 24 + 16}px` }}
          >
            {/* Drag Handle */}
            <div
              {...provided.dragHandleProps}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </div>

            {/* Expand/Collapse Button */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "w-6 h-6 flex items-center justify-center rounded hover:bg-muted",
                !hasChildren && "invisible"
              )}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </button>

            {/* Category Icon */}
            <div
              className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center",
                levelBadge.bg
              )}
            >
              <span className={cn("font-semibold text-sm", levelBadge.text)}>
                {category.name[0]?.toUpperCase()}
              </span>
            </div>

            {/* Category Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground truncate">
                  {category.name}
                </p>
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded font-medium",
                    levelBadge.bg,
                    levelBadge.text
                  )}
                >
                  {levelBadge.label}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {category.slug}
                {category.description && ` • ${category.description}`}
              </p>
            </div>

            {/* Children count */}
            {hasChildren && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                {category.children.length} podkategorija
              </span>
            )}

            {/* Status */}
            <StatusBadge status={category.isActive ? "active" : "inactive"} />

            {/* Actions */}
            <div className="flex items-center gap-1">
              {canAddChild && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-brand-orange"
                  onClick={() => onAddChild(category.id, category.level)}
                  title="Dodaj podkategoriju"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => onEdit(category)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(category)}
                disabled={hasChildren}
                title={hasChildren ? "Prvo obrišite podkategorije" : "Obriši"}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Children */}
          {isExpanded && hasChildren && (
            <DragDropContext onDragEnd={handleChildDragEnd}>
              <Droppable droppableId={`children-${category.id}`}>
                {(droppableProvided) => (
                  <div
                    ref={droppableProvided.innerRef}
                    {...droppableProvided.droppableProps}
                  >
                    {category.children.map((child, childIndex) => (
                      <DraggableCategoryRow
                        key={child.id}
                        category={child}
                        index={childIndex}
                        depth={depth + 1}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onAddChild={onAddChild}
                        onReorder={onReorder}
                      />
                    ))}
                    {droppableProvided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      )}
    </Draggable>
  );
}

interface FormData {
  name: string;
  description: string;
  parent: string;
  isActive: boolean;
}

export default function CategoriesPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryTreeNode | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<CategoryTreeNode | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    parent: "",
    isActive: true,
  });
  const [localTree, setLocalTree] = useState<CategoryTreeNode[]>([]);

  const { data: treeData, isLoading } = useCategoryTree();
  const { data: categoriesData } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const reorderCategories = useReorderCategories();

  // Sync local tree with server data
  useEffect(() => {
    if (treeData?.data) {
      setLocalTree(treeData.data);
    }
  }, [treeData]);

  // Show toast notifications for reorder success/error
  useEffect(() => {
    if (reorderCategories.isSuccess) {
      toast.success("Redoslijed kategorija uspješno spremljen");
    }
    if (reorderCategories.isError) {
      toast.error("Greška pri spremanju redoslijeda");
    }
  }, [reorderCategories.isSuccess, reorderCategories.isError]);

  // Get categories that can be parents (level 1 or 2)
  const possibleParents = (categoriesData?.data || []).filter(
    (c) => c.level < 3 && c.id !== editingCategory?.id
  );

  // Flatten tree to get ordered IDs with their order values
  const flattenTreeForReorder = (
    tree: CategoryTreeNode[],
    parentId: string | null = null
  ): { id: string; order: number; parentId?: string | null }[] => {
    const result: { id: string; order: number; parentId?: string | null }[] = [];
    tree.forEach((node, index) => {
      result.push({ id: node.id, order: index, parentId });
      if (node.children && node.children.length > 0) {
        result.push(...flattenTreeForReorder(node.children, node.id));
      }
    });
    return result;
  };

  const handleRootDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedTree = Array.from(localTree);
    const [removed] = reorderedTree.splice(result.source.index, 1);
    reorderedTree.splice(result.destination.index, 0, removed);

    setLocalTree(reorderedTree);

    // Save the new order to the server
    const orderedIds = flattenTreeForReorder(reorderedTree);
    reorderCategories.mutate(orderedIds);
  };

  const handleChildReorder = (parentId: string | null, orderedChildren: CategoryTreeNode[]) => {
    // Update local tree
    const updateTreeNode = (nodes: CategoryTreeNode[]): CategoryTreeNode[] => {
      return nodes.map((node) => {
        if (node.id === parentId) {
          return { ...node, children: orderedChildren };
        }
        if (node.children && node.children.length > 0) {
          return { ...node, children: updateTreeNode(node.children) };
        }
        return node;
      });
    };

    const newTree = updateTreeNode(localTree);
    setLocalTree(newTree);

    // Save the new order to the server
    const orderedIds = flattenTreeForReorder(newTree);
    reorderCategories.mutate(orderedIds);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({
          id: editingCategory.id,
          data: {
            name: formData.name,
            description: formData.description || undefined,
            parent: formData.parent || undefined,
            isActive: formData.isActive,
          },
        });
      } else {
        await createCategory.mutateAsync({
          name: formData.name,
          description: formData.description || undefined,
          parent: formData.parent || undefined,
          isActive: formData.isActive,
        });
      }
      setIsDrawerOpen(false);
      setEditingCategory(null);
      setFormData({ name: "", description: "", parent: "", isActive: true });
    } catch (error) {
      console.error("Greška pri spremanju kategorije:", error);
    }
  };

  const handleEdit = (category: CategoryTreeNode) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      parent: category.parent?.id || "",
      isActive: category.isActive,
    });
    setIsDrawerOpen(true);
  };

  const handleAddChild = (parentId: string, parentLevel: number) => {
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      parent: parentId,
      isActive: true,
    });
    setIsDrawerOpen(true);
  };

  const handleDelete = async () => {
    if (deletingCategory) {
      try {
        await deleteCategory.mutateAsync(deletingCategory.id);
        setDeletingCategory(null);
      } catch (error) {
        console.error("Greška pri brisanju:", error);
      }
    }
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setFormData({ name: "", description: "", parent: "", isActive: true });
    setIsDrawerOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      <AdminHeader
        title="Kategorije"
        description="Organizirajte proizvode u 3 nivoa kategorija - povucite za promjenu redoslijeda"
        actions={
          <Button onClick={handleAddNew}>
            <Plus className="w-4 h-4 mr-2" />
            Nova kategorija
          </Button>
        }
      />

      <div className="flex-1 p-6">
        {/* Legend */}
        <div className="mb-6 flex items-center gap-6 text-sm">
          <span className="text-muted-foreground">Nivoi:</span>
          {Object.entries(levelBadges).map(([level, badge]) => (
            <div key={level} className="flex items-center gap-2">
              <span
                className={cn(
                  "w-3 h-3 rounded",
                  level === "1" ? "bg-brand-orange" : level === "2" ? "bg-blue-500" : "bg-emerald-500"
                )}
              />
              <span className="text-muted-foreground">{badge.label}</span>
            </div>
          ))}
          <div className="ml-auto flex items-center gap-2 text-muted-foreground">
            <GripVertical className="w-4 h-4" />
            <span>Povucite za promjenu redoslijeda</span>
          </div>
        </div>

        {/* Tree View */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-brand-orange" />
              <span className="ml-2 text-muted-foreground">Učitavanje...</span>
            </div>
          ) : !localTree || localTree.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FolderTree className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Nema kategorija
              </h3>
              <p className="text-muted-foreground mb-4">
                Kreirajte prvu kategoriju za organizaciju proizvoda
              </p>
              <Button onClick={handleAddNew}>
                <Plus className="w-4 h-4 mr-2" />
                Dodaj prvu kategoriju
              </Button>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleRootDragEnd}>
              <Droppable droppableId="root-categories">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {localTree.map((category, index) => (
                      <DraggableCategoryRow
                        key={category.id}
                        category={category}
                        index={index}
                        depth={0}
                        onEdit={handleEdit}
                        onDelete={setDeletingCategory}
                        onAddChild={handleAddChild}
                        onReorder={handleChildReorder}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>

        {/* Saving indicator */}
        {reorderCategories.isPending && (
          <div className="fixed bottom-6 right-6 bg-card border border-border shadow-lg rounded-lg px-4 py-2 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-brand-orange" />
            <span className="text-sm">Spremanje redoslijeda...</span>
          </div>
        )}
      </div>

      {/* Add/Edit Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} direction="right">
        <DrawerContent className="h-full w-full max-w-md ml-auto rounded-l-xl rounded-r-none">
          <DrawerHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle>
                  {editingCategory ? "Uredi kategoriju" : "Nova kategorija"}
                </DrawerTitle>
                <DrawerDescription>
                  {editingCategory
                    ? "Ažurirajte podatke o kategoriji"
                    : "Dodajte novu kategoriju proizvoda"}
                </DrawerDescription>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <Label htmlFor="name">Naziv *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Naziv kategorije"
                  required
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="parent">Nadkategorija</Label>
                <select
                  id="parent"
                  value={formData.parent}
                  onChange={(e) =>
                    setFormData({ ...formData, parent: e.target.value })
                  }
                  className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Bez nadkategorije (Glavna kategorija)</option>
                  {possibleParents.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {"—".repeat(cat.level - 1)} {cat.name}
                      {cat.level === 1 && " (Glavna)"}
                      {cat.level === 2 && " (Podkategorija)"}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  Maksimalno 3 nivoa kategorija
                </p>
              </div>

              <div>
                <Label htmlFor="description">Opis</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="mt-1.5 flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Opis kategorije (opciono)"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-input"
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  Aktivna kategorija
                </Label>
              </div>

              {(createCategory.isError || updateCategory.isError) && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                  {(createCategory.error as Error)?.message ||
                    (updateCategory.error as Error)?.message ||
                    "Greška pri spremanju"}
                </div>
              )}
            </div>

            <DrawerFooter className="border-t border-border">
              <div className="flex gap-3 w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDrawerOpen(false)}
                  className="flex-1"
                >
                  Odustani
                </Button>
                <Button
                  type="submit"
                  disabled={createCategory.isPending || updateCategory.isPending}
                  className="flex-1 bg-brand-orange hover:bg-brand-orange/90"
                >
                  {createCategory.isPending || updateCategory.isPending
                    ? "Spremanje..."
                    : "Spremi"}
                </Button>
              </div>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>

      {/* Delete Confirmation Drawer */}
      <Drawer open={!!deletingCategory} onOpenChange={(open) => !open && setDeletingCategory(null)} direction="right">
        <DrawerContent className="h-full w-full max-w-md ml-auto rounded-l-xl rounded-r-none">
          <DrawerHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <DrawerTitle className="text-destructive">Obriši kategoriju</DrawerTitle>
                  <DrawerDescription>
                    Ova akcija se ne može poništiti
                  </DrawerDescription>
                </div>
              </div>
              <DrawerClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto p-6">
            {deletingCategory && (
              <div className="space-y-6">
                {/* Category Preview Card */}
                <div className="bg-muted/50 rounded-xl p-5 border border-border">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center shrink-0",
                        levelBadges[deletingCategory.level as keyof typeof levelBadges]?.bg || "bg-brand-orange/10"
                      )}
                    >
                      <span className={cn(
                        "font-bold text-lg",
                        levelBadges[deletingCategory.level as keyof typeof levelBadges]?.text || "text-brand-orange"
                      )}>
                        {deletingCategory.name[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-foreground">
                        {deletingCategory.name}
                      </h3>
                      <span
                        className={cn(
                          "inline-block text-xs px-2 py-0.5 rounded-full font-medium mt-1",
                          levelBadges[deletingCategory.level as keyof typeof levelBadges]?.bg,
                          levelBadges[deletingCategory.level as keyof typeof levelBadges]?.text
                        )}
                      >
                        {levelBadges[deletingCategory.level as keyof typeof levelBadges]?.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Category Details */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Detalji kategorije
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                        <Hash className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Slug</p>
                        <p className="text-foreground font-mono">{deletingCategory.slug}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                        <Tag className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Status</p>
                        <StatusBadge status={deletingCategory.isActive ? "active" : "inactive"} />
                      </div>
                    </div>

                    {deletingCategory.description && (
                      <div className="flex items-start gap-3 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Opis</p>
                          <p className="text-foreground">{deletingCategory.description}</p>
                        </div>
                      </div>
                    )}

                    {deletingCategory.parent && (
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                          <FolderTree className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Nadkategorija</p>
                          <p className="text-foreground">{deletingCategory.parent.name}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Warning Message */}
                <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4">
                  <div className="flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-destructive mb-1">Upozorenje</p>
                      <p className="text-muted-foreground">
                        Brisanjem ove kategorije trajno ćete ukloniti sve njene podatke. 
                        Proizvodi povezani s ovom kategorijom neće biti obrisani, ali će im biti uklonjena ova kategorija.
                      </p>
                    </div>
                  </div>
                </div>

                {deleteCategory.isError && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                    {(deleteCategory.error as Error)?.message || "Greška pri brisanju kategorije"}
                  </div>
                )}
              </div>
            )}
          </div>

          <DrawerFooter className="border-t border-border">
            <div className="flex gap-3 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeletingCategory(null)}
                className="flex-1"
              >
                Odustani
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteCategory.isPending}
                className="flex-1"
              >
                {deleteCategory.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Brisanje...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Obriši kategoriju
                  </>
                )}
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
