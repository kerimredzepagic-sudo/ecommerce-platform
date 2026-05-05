import Image from "next/image";
import { Button } from "@/components/ui/button";

export function PromotionalBanner() {
  return (
    <section className="py-16">
      <div className="max-w-screen-extended mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-orange to-orange-600 min-h-[400px]">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/ajvar.png"
              alt="Ajvar"
              fill
              className="object-cover opacity-30"
            />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between h-full p-8 lg:p-16">
            {/* Left Side - Text */}
            <div className="flex-1 text-white max-w-lg">
              <p className="font-oswald text-sm uppercase tracking-widest mb-2 opacity-90">
                NAJTRAŽENIJI PROIZVOD
              </p>
              <h2 className="font-oswald text-3xl md:text-4xl font-bold leading-tight mb-4">
                Domaca receptura i domace paprike - idealan spoj za savrsen
                ajvar
              </h2>
              <p className="font-poppins text-sm opacity-90 mb-6">
                Autentičan bosanski ukus napravljen u skladnoj Pazar Premium
                proizvodnji od paprike uzorene na idealnoj i svježoj hranjici Od
                svežeg branja do pecerija paprike za 4 sata je naslanjeni
              </p>
              <div className="flex flex-wrap gap-3">
                <Button className="font-oswald uppercase bg-white text-brand-orange hover:bg-gray-100">
                  POGLEDAJ KATEGORIJU
                </Button>
                <Button
                  variant="outline"
                  className="font-oswald uppercase border-white text-white hover:bg-white hover:text-brand-orange"
                >
                  KORPORATIVNI POKLONI
                </Button>
              </div>
            </div>

            {/* Right Side - Quote */}
            <div className="flex-1 flex items-center justify-center mt-8 lg:mt-0">
              <div className="text-white text-right">
                <p className="font-serif text-2xl md:text-3xl italic leading-relaxed">
                  &ldquo;Paznja je luksuz.
                  <br />
                  Ovo je poklon koji
                  <br />
                  to razumije.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


