"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useLocations,
  useDeleteLocation,
  useReorderLocations,
  useToggleLocationActive,
  useToggleLocationHighlight,
  Location,
} from "@/hooks/useAdminApi";
import { AdminHeader } from "@/components/admin/AdminHeader";
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
  MapPin,
  Star,
  StarOff,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

// Sortable row component
function SortableRow({
  location,
  onEdit,
  onDelete,
  onToggleActive,
  onToggleHighlight,
}: {
  location: Location;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
  onToggleHighlight: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: location.id });

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

      {/* Name */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div>
            <p className="font-medium text-gray-900">{location.name}</p>
            {location.subtitle && (
              <p className="text-sm text-brand-orange">{location.subtitle}</p>
            )}
          </div>
          {location.isHighlight && (
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          )}
        </div>
      </td>

      {/* Address */}
      <td className="px-4 py-3">
        <div className="text-sm">
          <p className="text-gray-900">{location.address}</p>
          <p className="text-gray-500">{location.city}</p>
        </div>
      </td>

      {/* Contact */}
      <td className="px-4 py-3">
        <div className="text-sm">
          <p className="text-gray-900">{location.phone}</p>
          <p className="text-gray-500">{location.email}</p>
        </div>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <StatusBadge status={location.isActive ? "active" : "inactive"} />
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
            <DropdownMenuItem onClick={() => onEdit(location.id)}>
              <Pencil className="w-4 h-4 mr-2" />
              Uredi
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleHighlight(location.id)}>
              {location.isHighlight ? (
                <>
                  <StarOff className="w-4 h-4 mr-2" />
                  Ukloni iz istaknutih
                </>
              ) : (
                <>
                  <Star className="w-4 h-4 mr-2" />
                  Označi kao centralu
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleActive(location.id)}>
              {location.isActive ? (
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
              onClick={() => onDelete(location.id)}
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

export default function LocationsPage() {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [localLocations, setLocalLocations] = useState<Location[]>([]);

  const { data: locationsData, isLoading } = useLocations();
  const deleteLocation = useDeleteLocation();
  const reorderLocations = useReorderLocations();
  const toggleActive = useToggleLocationActive();
  const toggleHighlight = useToggleLocationHighlight();

  const locations = localLocations.length > 0 ? localLocations : locationsData?.data || [];

  // Update local locations when data changes
  useEffect(() => {
    if (locationsData?.data && locationsData.data.length > 0) {
      setLocalLocations(locationsData.data);
    }
  }, [locationsData?.data]);

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
      const oldIndex = locations.findIndex((l) => l.id === active.id);
      const newIndex = locations.findIndex((l) => l.id === over.id);

      const newLocations = arrayMove(locations, oldIndex, newIndex);
      setLocalLocations(newLocations);

      // Update order on server
      try {
        await reorderLocations.mutateAsync(
          newLocations.map((l, index) => ({ id: l.id, order: index }))
        );
        toast.success("Redoslijed poslovnica ažuriran");
      } catch {
        toast.error("Greška pri ažuriranju redoslijeda");
        setLocalLocations(locationsData?.data || []);
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteLocation.mutateAsync(deleteId);
      setLocalLocations((prev) => prev.filter((l) => l.id !== deleteId));
      toast.success("Poslovnica uspješno obrisana");
    } catch {
      toast.error("Greška pri brisanju poslovnice");
    } finally {
      setDeleteId(null);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      const result = await toggleActive.mutateAsync(id);
      setLocalLocations((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, isActive: result.data.isActive } : l
        )
      );
      toast.success("Status poslovnice ažuriran");
    } catch {
      toast.error("Greška pri promjeni statusa");
    }
  };

  const handleToggleHighlight = async (id: string) => {
    try {
      const result = await toggleHighlight.mutateAsync(id);
      setLocalLocations((prev) =>
        prev.map((l) =>
          l.id === id ? { ...l, isHighlight: result.data.isHighlight } : l
        )
      );
      toast.success("Istaknutost poslovnice ažurirana");
    } catch {
      toast.error("Greška pri promjeni istaknutosti");
    }
  };

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Poslovnice"
        description="Upravljajte poslovnicama i njihovim informacijama"
        actions={
          <Button
            onClick={() => router.push("/admin/locations/new")}
            className="bg-brand-orange hover:bg-brand-orange/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova poslovnica
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
        </div>
      ) : locations.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nema poslovnica
          </h3>
          <p className="text-gray-500 mb-6">
            Kreirajte prvu poslovnicu za prikaz na stranici.
          </p>
          <Button
            onClick={() => router.push("/admin/locations/new")}
            className="bg-brand-orange hover:bg-brand-orange/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Kreiraj poslovnicu
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Naziv
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Adresa
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Kontakt
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
                  items={locations.map((l) => l.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {locations.map((location) => (
                    <SortableRow
                      key={location.id}
                      location={location}
                      onEdit={(id) => router.push(`/admin/locations/${id}`)}
                      onDelete={setDeleteId}
                      onToggleActive={handleToggleActive}
                      onToggleHighlight={handleToggleHighlight}
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
            <AlertDialogTitle>Obrisati poslovnicu?</AlertDialogTitle>
            <AlertDialogDescription>
              Ova akcija se ne može poništiti. Poslovnica će biti trajno obrisana.
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
