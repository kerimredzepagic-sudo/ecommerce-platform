import { ApiTerapijeCard } from "./ApiTerapijeCard";
import { SectionHeader } from "@/components/ui/section-header";

interface ApiProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  discount?: number;
}

const apiProducts: ApiProduct[] = [
  {
    id: "1",
    name: "API MINI",
    description: "20 Minuta",
    image: "/productimage.png",
  },
  {
    id: "2",
    name: "API FULL",
    description: "Proizvod koji liječe dušu...",
    image: "/productimage.png",
  },
  {
    id: "3",
    name: "PAKET 4 TRETMANA",
    description: "Proizvod koji liječe dušu...",
    image: "/productimage.png",
    discount: 10,
  },
  {
    id: "4",
    name: "PAKET 8 TRETMANA",
    description: "Proizvod koji liječe dušu...",
    image: "/productimage.png",
    discount: 20,
  },
];

export function ApiTerapijeSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-screen-extended mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <SectionHeader
            label="NAJODABRANIJE ZA VAS"
            title="Api Terapije"
            centered
          />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {apiProducts.map((product) => (
            <ApiTerapijeCard
              key={product.id}
              name={product.name}
              description={product.description}
              image={product.image}
              discount={product.discount}
            />
          ))}
        </div>
      </div>
    </section>
  );
}


