"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AttributesEditorProps {
  attributes: Record<string, string>;
  onChange: (attributes: Record<string, string>) => void;
}

export function AttributesEditor({
  attributes,
  onChange,
}: AttributesEditorProps) {
  const entries = Object.entries(attributes);

  const addAttribute = () => {
    onChange({ ...attributes, "": "" });
  };

  const updateKey = (oldKey: string, newKey: string) => {
    const value = attributes[oldKey];
    const newAttributes = { ...attributes };
    delete newAttributes[oldKey];
    newAttributes[newKey] = value;
    onChange(newAttributes);
  };

  const updateValue = (key: string, value: string) => {
    onChange({ ...attributes, [key]: value });
  };

  const removeAttribute = (key: string) => {
    const newAttributes = { ...attributes };
    delete newAttributes[key];
    onChange(newAttributes);
  };

  // Common attribute suggestions
  const suggestions = [
    "Sastojci",
    "Materijal",
    "Težina neto",
    "Rok trajanja",
    "Porijeklo",
    "Način primjene",
    "Čuvanje",
    "Certifikati",
  ];

  const addSuggested = (key: string) => {
    if (!attributes[key]) {
      onChange({ ...attributes, [key]: "" });
    }
  };

  return (
    <div className="space-y-4">
      {/* Attributes List */}
      {entries.length > 0 ? (
        <div className="space-y-2">
          {entries.map(([key, value], index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={key}
                onChange={(e) => updateKey(key, e.target.value)}
                placeholder="Naziv atributa"
                className="flex-1"
              />
              <Input
                value={value}
                onChange={(e) => updateValue(key, e.target.value)}
                placeholder="Vrijednost"
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeAttribute(key)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-400 border-2 border-dashed rounded-lg">
          <p>Nema custom atributa</p>
          <p className="text-sm">
            Dodajte atribute kao što su sastojci, materijal, itd.
          </p>
        </div>
      )}

      {/* Add Button */}
      <Button type="button" variant="outline" onClick={addAttribute}>
        <Plus className="w-4 h-4 mr-2" />
        Dodaj atribut
      </Button>

      {/* Suggestions */}
      <div>
        <p className="text-sm text-gray-500 mb-2">Brzi dodaj:</p>
        <div className="flex flex-wrap gap-2">
          {suggestions
            .filter((s) => !attributes[s])
            .map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addSuggested(suggestion)}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
              >
                + {suggestion}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

