"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  useSlides,
  useDeleteSlide,
  useReorderSlides,
  useToggleSlideActive,
  Slide,
} from "@/hooks/useAdminApi";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Video,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

// Sortable row component
function SortableRow({
  slide,
  onEdit,
  onDelete,
  onToggleActive,
}: {
  slide: Slide;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className="border-b border-gray-100 hover:bg-gray-50/50"
    >
      {/* Drag Handle */}
      <td className="px-4 py-3 w-12">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        >
          <GripVertical className="w-5 h-5" />
        </button>
      </td>

      {/* Thumbnail */}
      <td className="px-4 py-3 w-24">
        <div className="relative w-16 h-10 rounded overflow-hidden bg-gray-100">
          {slide.backgroundType === "video" ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <Video className="w-6 h-6 text-gray-400" />
            </div>
          ) : slide.backgroundUrl ? (
            <Image
              src={slide.backgroundUrl}
              alt={slide.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>
      </td>

      {/* Title */}
      <td className="px-4 py-3">
        <div>
          <p className="font-medium text-gray-900">{slide.title}</p>
          {slide.headTitle && (
            <p className="text-sm text-brand-orange">{slide.headTitle}</p>
          )}
        </div>
      </td>

      {/* Type */}
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
          {slide.backgroundType === "video" ? (
            <>
              <Video className="w-4 h-4" /> Video
            </>
          ) : (
            <>
              <ImageIcon className="w-4 h-4" /> Slika
            </>
          )}
        </span>
      </td>

      {/* Location */}
      <td className="px-4 py-3">
        <span className="text-sm text-gray-600 capitalize">
          {slide.location === "shop" ? "Prodavnica" : "Korporativna"}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <StatusBadge status={slide.isActive ? "active" : "inactive"} />
      </td>

      {/* Actions */}
      <td className="px-4 py-3 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(slide.id)}>
              <Pencil className="w-4 h-4 mr-2" />
              Uredi
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleActive(slide.id)}>
              {slide.isActive ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Deaktiviraj
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Aktiviraj
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(slide.id)}
              className="text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Obriši
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

export default function SlidesPage() {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [localSlides, setLocalSlides] = useState<Slide[]>([]);

  const { data: slidesData, isLoading } = useSlides();
  const deleteSlide = useDeleteSlide();
  const reorderSlides = useReorderSlides();
  const toggleActive = useToggleSlideActive();

  const slides = localSlides.length > 0 ? localSlides : slidesData?.data || [];

  // Update local slides when data changes
  useEffect(() => {
    if (slidesData?.data && slidesData.data.length > 0) {
      setLocalSlides(slidesData.data);
    }
  }, [slidesData?.data]);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = slides.findIndex((s) => s.id === active.id);
      const newIndex = slides.findIndex((s) => s.id === over.id);

      const newSlides = arrayMove(slides, oldIndex, newIndex);
      setLocalSlides(newSlides);

      // Update order on server
      try {
        await reorderSlides.mutateAsync(
          newSlides.map((s, index) => ({ id: s.id, order: index }))
        );
        toast.success("Redoslijed slajdova ažuriran");
      } catch {
        toast.error("Greška pri ažuriranju redoslijeda");
        setLocalSlides(slidesData?.data || []);
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteSlide.mutateAsync(deleteId);
      setLocalSlides((prev) => prev.filter((s) => s.id !== deleteId));
      toast.success("Slajd uspješno obrisan");
    } catch {
      toast.error("Greška pri brisanju slajda");
    } finally {
      setDeleteId(null);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      const result = await toggleActive.mutateAsync(id);
      setLocalSlides((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, isActive: result.data.isActive } : s
        )
      );
      toast.success("Status slajda ažuriran");
    } catch {
      toast.error("Greška pri promjeni statusa");
    }
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Slajdovi"
        description="Upravljajte hero slajdovima za prodavnicu"
        actions={
          <Button
            onClick={() => router.push("/admin/slides/new")}
            className="bg-brand-orange hover:bg-brand-orange/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novi slajd
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
        </div>
      ) : slides.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nema slajdova
          </h3>
          <p className="text-gray-500 mb-6">
            Kreirajte prvi slajd za hero sekciju prodavnice.
          </p>
          <Button
            onClick={() => router.push("/admin/slides/new")}
            className="bg-brand-orange hover:bg-brand-orange/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Kreiraj slajd
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-12"></th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-24">
                    Pregled
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Naslov
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tip
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Lokacija
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase w-20">
                    Akcije
                  </th>
                </tr>
              </thead>
              <tbody>
                <SortableContext
                  items={slides.map((s) => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {slides.map((slide) => (
                    <SortableRow
                      key={slide.id}
                      slide={slide}
                      onEdit={(id) => router.push(`/admin/slides/${id}`)}
                      onDelete={setDeleteId}
                      onToggleActive={handleToggleActive}
                    />
                  ))}
                </SortableContext>
              </tbody>
            </table>
          </DndContext>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Obrisati slajd?</AlertDialogTitle>
            <AlertDialogDescription>
              Ova akcija se ne može poništiti. Slajd će biti trajno obrisan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Odustani</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Obriši
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

