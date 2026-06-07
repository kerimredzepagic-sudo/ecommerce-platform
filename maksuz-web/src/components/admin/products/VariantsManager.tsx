"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface ProductVariant {
  id: string;
  name: string;
  sku?: string;
  price?: number;
  stock: number;
  attributes: Array<{ key: string; value: string }>;
  images: string[];
}

interface VariantsManagerProps {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
  basePrice: number;
}

export function VariantsManager({
  variants,
  onChange,
  basePrice,
}: VariantsManagerProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: crypto.randomUUID(),
      name: "",
      sku: "",
      price: undefined,
      stock: 0,
      attributes: [],
      images: [],
    };
    onChange([...variants, newVariant]);
    setExpandedId(newVariant.id);
  };

  const updateVariant = (id: string, updates: Partial<ProductVariant>) => {
    onChange(
      variants.map((v) => (v.id === id ? { ...v, ...updates } : v))
    );
  };

  const removeVariant = (id: string) => {
    onChange(variants.filter((v) => v.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const addAttribute = (variantId: string) => {
    const variant = variants.find((v) => v.id === variantId);
    if (!variant) return;

    updateVariant(variantId, {
      attributes: [...variant.attributes, { key: "", value: "" }],
    });
  };

  const updateAttribute = (
    variantId: string,
    attrIndex: number,
    field: "key" | "value",
    value: string
  ) => {
    const variant = variants.find((v) => v.id === variantId);
    if (!variant) return;

    const newAttributes = [...variant.attributes];
    newAttributes[attrIndex] = { ...newAttributes[attrIndex], [field]: value };
    updateVariant(variantId, { attributes: newAttributes });
  };

  const removeAttribute = (variantId: string, attrIndex: number) => {
    const variant = variants.find((v) => v.id === variantId);
    if (!variant) return;

    const newAttributes = variant.attributes.filter((_, i) => i !== attrIndex);
    updateVariant(variantId, { attributes: newAttributes });
  };

  return (
    <div className="space-y-4">
      {/* Variants List */}
      {variants.length > 0 ? (
        <div className="space-y-3">
          {variants.map((variant, index) => (
            <div
              key={variant.id}
              className="border rounded-lg bg-white overflow-hidden"
            >
              {/* Variant Header */}
              <div
                className={cn(
                  "flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50",
                  expandedId === variant.id && "border-b bg-gray-50"
                )}
                onClick={() =>
                  setExpandedId(expandedId === variant.id ? null : variant.id)
                }
              >
                <GripVertical className="w-4 h-4 text-gray-400" />
                <div className="flex-1">
                  <span className="font-medium">
                    {variant.name || `Varijanta ${index + 1}`}
                  </span>
                  {variant.sku && (
                    <span className="text-sm text-gray-500 ml-2">
                      SKU: {variant.sku}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  <span>Zaliha: {variant.stock}</span>
                  <span className="ml-4">
                    Cijena: {(variant.price ?? basePrice).toFixed(2)} KM
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeVariant(variant.id);
                  }}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                {expandedId === variant.id ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>

              {/* Variant Details */}
              {expandedId === variant.id && (
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Naziv varijante *
                      </label>
                      <Input
                        value={variant.name}
                        onChange={(e) =>
                          updateVariant(variant.id, { name: e.target.value })
                        }
                        placeholder="npr. Mala, Crvena, 500g"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        SKU
                      </label>
                      <Input
                        value={variant.sku || ""}
                        onChange={(e) =>
                          updateVariant(variant.id, { sku: e.target.value })
                        }
                        placeholder="Šifra varijante"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Zaliha
                      </label>
                      <Input
                        type="number"
                        value={variant.stock}
                        onChange={(e) =>
                          updateVariant(variant.id, {
                            stock: parseInt(e.target.value) || 0,
                          })
                        }
                        min={0}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cijena (prazno = osnovna cijena: {basePrice.toFixed(2)} KM)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={variant.price ?? ""}
                      onChange={(e) =>
                        updateVariant(variant.id, {
                          price: e.target.value
                            ? parseFloat(e.target.value)
                            : undefined,
                        })
                      }
                      placeholder={basePrice.toFixed(2)}
                    />
                  </div>

                  {/* Attributes */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Atributi
                      </label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addAttribute(variant.id)}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Dodaj atribut
                      </Button>
                    </div>
                    {variant.attributes.length > 0 ? (
                      <div className="space-y-2">
                        {variant.attributes.map((attr, attrIndex) => (
                          <div
                            key={attrIndex}
                            className="flex items-center gap-2"
                          >
                            <Input
                              value={attr.key}
                              onChange={(e) =>
                                updateAttribute(
                                  variant.id,
                                  attrIndex,
                                  "key",
                                  e.target.value
                                )
                              }
                              placeholder="Ključ (npr. Veličina)"
                              className="flex-1"
                            />
                            <Input
                              value={attr.value}
                              onChange={(e) =>
                                updateAttribute(
                                  variant.id,
                                  attrIndex,
                                  "value",
                                  e.target.value
                                )
                              }
                              placeholder="Vrijednost (npr. Velika)"
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                removeAttribute(variant.id, attrIndex)
                              }
                              className="text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">
                        Nema atributa. Dodajte atribute kao što su veličina, boja, itd.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400 border-2 border-dashed rounded-lg">
          <p>Nema varijanti</p>
          <p className="text-sm">
            Dodajte varijante ako proizvod dolazi u različitim veličinama, bojama, itd.
          </p>
        </div>
      )}

      {/* Add Variant Button */}
      <Button type="button" variant="outline" onClick={addVariant}>
        <Plus className="w-4 h-4 mr-2" />
        Dodaj varijantu
      </Button>

      {/* Summary */}
      {variants.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Pregled varijanti</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Ukupno varijanti:</span>
              <span className="font-medium ml-2">{variants.length}</span>
            </div>
            <div>
              <span className="text-gray-500">Ukupna zaliha:</span>
              <span className="font-medium ml-2">
                {variants.reduce((sum, v) => sum + v.stock, 0)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Raspon cijena:</span>
              <span className="font-medium ml-2">
                {Math.min(
                  ...variants.map((v) => v.price ?? basePrice)
                ).toFixed(2)}{" "}
                -{" "}
                {Math.max(
                  ...variants.map((v) => v.price ?? basePrice)
                ).toFixed(2)}{" "}
                KM
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

