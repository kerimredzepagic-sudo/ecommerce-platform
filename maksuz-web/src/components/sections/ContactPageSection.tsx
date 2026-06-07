"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { cn } from "@/lib/utils";
import { SectionHeader } from "../ui/section-header";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  Store,
  ArrowRight,
  User,
  FileText,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const formSchema = z.object({
  name: z.string().min(1, "Ime je obavezno"),
  email: z.string().email("Neispravna email adresa"),
  phone: z.string().min(1, "Telefon je obavezan"),
  subject: z.string().min(1, "Predmet je obavezan"),
  message: z.string().min(1, "Poruka je obavezna"),
});

type FormValues = z.infer<typeof formSchema>;

const contactInfo = [
  {
    icon: MapPin,
    title: "ADRESA",
    content: "Hamdije Čemerlića 49, Novo Sarajevo",
    link: "https://maps.google.com/?q=Hamdije+%C4%8Cemerli%C4%87a+49+Novo+Sarajevo",
  },
  {
    icon: Phone,
    title: "TELEFON",
    content: "+387 61 399 366",
    link: "tel:+38761399366",
  },
  {
    icon: Mail,
    title: "EMAIL",
    content: "info@maksuz.ba",
    link: "mailto:info@maksuz.ba",
  },
  {
    icon: Clock,
    title: "RADNO VRIJEME",
    content: "Pon - Pet: 09:00 - 17:00",
    link: null,
  },
];

const locations = [
  {
    name: "Maloprodajni objekat",
    address: "Hamdije Čemerlića 49, Grbavica",
    type: "Glavni",
  },
  {
    name: "Maksuz kutak",
    address: "Bingo City Center, Ilidža",
    type: "Kutak",
  },
  {
    name: "Api wellness centar",
    address: "Vidovci 86, Blažuj",
    type: "Wellness",
  },
  {
    name: "Maksuz kutak",
    address: "TC Džananović, Zenica",
    type: "Kutak",
  },
];

export function ContactPageSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const locationsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log(values);
  };

  // Google Maps embed URL for Hamdije Čemerlića 49, Novo Sarajevo
  const mapsEmbedUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2878.5!2d18.4!3d43.85!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDPCsDUxJzAwLjAiTiAxOMKwMjQnMDAuMCJF!5e0!3m2!1sen!2sba!4v1234567890123!5m2!1sen!2sba";

  useEffect(() => {
    // Header Animation
    if (headerRef.current) {
      const subtitle = headerRef.current.querySelector("p");
      const title = headerRef.current.querySelector("h2");
      const description = headerRef.current.querySelector(".header-desc");

      gsap.fromTo(
        subtitle,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        title,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      if (description) {
        gsap.fromTo(
          description,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.4,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }

    // Form Section Animation
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, x: -60, scale: 0.95 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      const inputs = formRef.current.querySelectorAll(".form-input");
      gsap.fromTo(
        inputs,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Info Section Animation
    if (infoRef.current) {
      gsap.fromTo(
        infoRef.current,
        { opacity: 0, x: 60, scale: 0.95 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: infoRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      const items = infoRef.current.querySelectorAll(".info-item");
      const icons = infoRef.current.querySelectorAll(".info-icon");

      gsap.fromTo(
        items,
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.15,
          delay: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: infoRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        icons,
        { scale: 0, rotation: -180 },
        {
          scale: 1,
          rotation: 0,
          duration: 0.6,
          stagger: 0.15,
          delay: 0.5,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: infoRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Map Section Animation
    if (mapRef.current) {
      gsap.fromTo(
        mapRef.current,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: mapRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Locations Section Animation
    if (locationsRef.current) {
      const header = locationsRef.current.querySelector(".locations-header");
      const cards = locationsRef.current.querySelectorAll(".location-card");

      gsap.fromTo(
        header,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: locationsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        cards,
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.15,
          delay: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: locationsRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // CTA Section Animation
    if (ctaRef.current) {
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Cleanup ScrollTrigger instances on unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        trigger.kill();
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className="w-full">
      {/* Header Section */}
      <div ref={headerRef} className="w-full py-16 px-4 md:px-8 bg-white">
        <div className="max-w-screen-extended mx-auto">
          <SectionHeader
            label="KONTAKT"
            title="Stupite u kontakt s nama"
            description="Tu smo za sva vaša pitanja, sugestije i narudžbe. Naš tim je spreman da vam pomogne i odgovori na sve vaše upite."
            centered
          />
        </div>
      </div>

      {/* Main Content - Form and Info */}
      <div className="w-full py-16 px-4 md:px-8 bg-[#F4F6F0]">
        <div className="max-w-screen-extended mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left - Contact Form */}
            <div ref={formRef} className="bg-white rounded-[40px] p-8 md:p-12 shadow-lg">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-full bg-brand-orange flex items-center justify-center">
                  <MessageSquare className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-oswald font-bold text-2xl text-gray-900 uppercase">
                    Pošaljite nam poruku
                  </h3>
                  <p className="font-poppins text-gray-600 text-sm">
                    Odgovorićemo u najkraćem mogućem roku
                  </p>
                </div>
              </div>

              {/* Decorative line */}
              <div className="flex items-center gap-2 mb-8">
                <div className="flex-1 h-0.5 bg-gradient-to-r from-brand-orange to-transparent" />
                <div className="w-2 h-2 rounded-full bg-brand-orange" />
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-5"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="form-input">
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <Input
                                {...field}
                                placeholder="Vaše ime"
                                className="rounded-full border-gray-200 bg-gray-50 focus:border-brand-orange focus:ring-brand-orange py-6 pl-14 pr-6 font-poppins"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="form-input">
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <Input
                                type="email"
                                {...field}
                                placeholder="Email adresa"
                                className="rounded-full border-gray-200 bg-gray-50 focus:border-brand-orange focus:ring-brand-orange py-6 pl-14 pr-6 font-poppins"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="form-input">
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <Input
                                {...field}
                                placeholder="Broj telefona"
                                className="rounded-full border-gray-200 bg-gray-50 focus:border-brand-orange focus:ring-brand-orange py-6 pl-14 pr-6 font-poppins"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem className="form-input">
                          <FormControl>
                            <div className="relative">
                              <FileText className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <Input
                                {...field}
                                placeholder="Predmet"
                                className="rounded-full border-gray-200 bg-gray-50 focus:border-brand-orange focus:ring-brand-orange py-6 pl-14 pr-6 font-poppins"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="form-input">
                        <FormControl>
                          <div className="relative">
                            <MessageSquare className="absolute left-5 top-5 w-5 h-5 text-gray-400" />
                            <textarea
                              {...field}
                              placeholder="Vaša poruka..."
                              rows={6}
                              className={cn(
                                "flex w-full rounded-[25px] border border-gray-200 bg-gray-50 pl-14 pr-6 py-4 text-sm shadow-sm transition-colors font-poppins",
                                "placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-orange focus-visible:border-brand-orange",
                                "disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                              )}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="bg-brand-orange hover:bg-brand-orange/90 font-oswald uppercase mt-4 py-6 rounded-full text-lg"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Pošalji poruku
                  </Button>
                </form>
              </Form>
            </div>

            {/* Right - Contact Information */}
            <div ref={infoRef} className="flex flex-col gap-8">
              {/* Info Cards */}
              <div className="bg-gray-900 rounded-[40px] p-8 md:p-12 text-white">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-full bg-brand-orange flex items-center justify-center">
                    <Phone className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-oswald font-bold text-2xl uppercase">
                      Kontakt informacije
                    </h3>
                    <p className="font-poppins text-gray-400 text-sm">
                      Dostupni smo za vas
                    </p>
                  </div>
                </div>

                {/* Decorative line */}
                <div className="flex items-center gap-2 mb-8">
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-brand-orange to-transparent" />
                  <div className="w-2 h-2 rounded-full bg-brand-orange" />
                </div>

                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={info.title} className="info-item">
                      {info.link ? (
                        <a
                          href={info.link}
                          target={info.link.startsWith("http") ? "_blank" : undefined}
                          rel={info.link.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="flex items-start gap-4 group"
                        >
                          <div className="info-icon w-12 h-12 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-orange transition-colors duration-300">
                            <info.icon className="w-6 h-6 text-brand-orange group-hover:text-white transition-colors duration-300" />
                          </div>
                          <div className="flex flex-col">
                            <p className="font-oswald font-bold text-white text-sm mb-1 uppercase tracking-wider">
                              {info.title}
                            </p>
                            <p className="font-poppins text-gray-300 group-hover:text-brand-orange transition-colors duration-300">
                              {info.content}
                            </p>
                          </div>
                        </a>
                      ) : (
                        <div className="flex items-start gap-4">
                          <div className="info-icon w-12 h-12 rounded-full bg-brand-orange/20 flex items-center justify-center flex-shrink-0">
                            <info.icon className="w-6 h-6 text-brand-orange" />
                          </div>
                          <div className="flex flex-col">
                            <p className="font-oswald font-bold text-white text-sm mb-1 uppercase tracking-wider">
                              {info.title}
                            </p>
                            <p className="font-poppins text-gray-300">
                              {info.content}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Decorative element */}
                <div className="mt-8 flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-brand-orange" />
                  <div className="w-2 h-2 rounded-full bg-brand-orange" />
                  <div className="w-8 h-0.5 bg-brand-orange" />
                </div>
              </div>

              {/* Decorative Image */}
              <div className="relative h-64 rounded-[40px] overflow-hidden">
                <Image
                  src="/apiTherapyGardening.svg"
                  alt="Maksuz"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="font-oswald text-white text-xl font-bold uppercase">
                    Posjeti nas
                  </p>
                  <p className="font-poppins text-white/80 text-sm">
                    Uvijek ste dobrodošli u naše poslovnice
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div ref={mapRef} className="w-full py-16 px-4 md:px-8 bg-white">
        <div className="max-w-screen-extended mx-auto">
          <div className="relative rounded-[50px] overflow-hidden shadow-xl">
            <iframe
              src={mapsEmbedUrl}
              width="100%"
              height="500"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
            {/* Decorative overlay corners */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-brand-orange rounded-tl-[50px]" />
            <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-brand-orange rounded-tr-[50px]" />
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-brand-orange rounded-bl-[50px]" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-brand-orange rounded-br-[50px]" />
          </div>
        </div>
      </div>

      {/* Locations Section */}
      <div ref={locationsRef} className="w-full py-24 px-4 md:px-8 bg-gray-900 text-white">
        <div className="max-w-screen-extended mx-auto">
          <div className="locations-header mb-16">
            <SectionHeader
              label="NAŠE LOKACIJE"
              title="Posjeti Maksuz poslovnice"
              description="Pronađite nas na lokacijama širom BiH. Svaka poslovnica nudi kompletan asortiman naših proizvoda."
              theme="dark"
              centered
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {locations.map((location, index) => (
              <div
                key={location.name + index}
                className="location-card bg-white/5 backdrop-blur-sm rounded-[30px] p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-full bg-brand-orange flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Store className="w-7 h-7 text-white" />
                </div>
                <span className="inline-block px-3 py-1 bg-brand-orange/20 text-brand-orange text-xs font-oswald uppercase rounded-full mb-4">
                  {location.type}
                </span>
                <h3 className="font-oswald font-bold text-lg text-white mb-2 uppercase">
                  {location.name}
                </h3>
                <p className="font-poppins text-gray-400 text-sm leading-relaxed">
                  {location.address}
                </p>
                {/* Decorative line */}
                <div className="mt-6 flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-brand-orange" />
                  <div className="w-2 h-2 rounded-full bg-brand-orange" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div ref={ctaRef} className="w-full py-24 px-4 md:px-8 bg-[#F4F6F0]">
        <div className="max-w-screen-extended mx-auto">
          <div className="bg-brand-orange rounded-[50px] p-12 md:p-16 lg:p-20 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-white/10 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full bg-white/5 translate-x-1/4 translate-y-1/4" />
            <Image
              src="/flowerPots.svg"
              alt="Decorative"
              width={200}
              height={200}
              className="absolute top-[-30px] right-8 opacity-40 hidden lg:block"
            />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left">
                <SectionHeader
                  label="IMATE PITANJA?"
                  title="Pozovite nas direktno"
                  description="Naš tim je spreman da odgovori na sva vaša pitanja"
                  theme="brand"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="tel:+38761399366">
                  <Button className="bg-gray-900 hover:bg-gray-800 text-white font-oswald uppercase px-8 py-6 text-lg rounded-full">
                    <Phone className="w-5 h-5 mr-2" />
                    +387 61 399 366
                  </Button>
                </a>
                <Link href="/shop">
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-brand-orange font-oswald uppercase px-8 py-6 text-lg rounded-full">
                    Webshop
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
