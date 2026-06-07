"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Phone, CheckCircle, Save, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const completeProfileSchema = z.object({
  phone: z.string().optional(),
});

type CompleteProfileFormValues = z.infer<typeof completeProfileSchema>;

export default function CompleteProfilePageClient() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { login } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if not authenticated via NextAuth
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // If user's profile is already completed, redirect to admin
  useEffect(() => {
    if (session && (session as any).profileCompleted) {
      // Store the tokens in our auth context and redirect
      const backendUser = (session as any).backendUser;
      const accessToken = (session as any).accessToken;
      const refreshToken = (session as any).refreshToken;

      if (backendUser && accessToken && refreshToken) {
        login({ accessToken, refreshToken }, backendUser);
        router.push("/admin");
      }
    }
  }, [session, router, login]);

  const form = useForm<CompleteProfileFormValues>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      phone: "",
    },
  });

  const onSubmit = async (values: CompleteProfileFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const accessToken = (session as any)?.accessToken;

      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await fetch(`${API_URL}/auth/complete-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ phone: values.phone }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to complete profile");
      }

      // Store the tokens in our auth context
      const backendUser = (session as any).backendUser;
      const refreshToken = (session as any).refreshToken;

      if (backendUser && refreshToken) {
        // Update the user with profileCompleted: true
        login(
          { accessToken, refreshToken },
          { ...backendUser, profileCompleted: true, phone: values.phone }
        );
      }

      // Redirect to admin
      router.push("/admin");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Greška pri dopuni profila"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    // Allow users to skip and complete later
    const accessToken = (session as any)?.accessToken;
    const backendUser = (session as any)?.backendUser;
    const refreshToken = (session as any)?.refreshToken;

    if (backendUser && accessToken && refreshToken) {
      login({ accessToken, refreshToken }, backendUser);
      router.push("/admin");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
      </div>
    );
  }

  const userName =
    (session as any)?.backendUser?.firstName ||
    session?.user?.name?.split(" ")[0] ||
    "Korisnik";

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 overflow-hidden">
      {/* Left Side - Video Background */}
      <div className="relative hidden lg:flex flex-col items-center justify-center p-10 text-white overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-transform duration-[1500ms] ease-out",
            mounted ? "scale-100" : "scale-110"
          )}
        >
          <source src="/7015764_Car_Jeep_1280x720.mp4" type="video/mp4" />
        </video>

        {/* Black Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />

        {/* Centered Content */}
        <div className="relative z-20 flex flex-col items-center text-center max-w-lg">
          {/* Logo - Bigger and Centered */}
          <div
            className={cn(
              "relative w-40 h-40 mb-6 transition-all duration-700 ease-out",
              mounted ? "opacity-100 scale-100" : "opacity-0 scale-75"
            )}
            style={{ transitionDelay: "200ms" }}
          >
            <Image
              src="/MAKSUZ_mix_logo.png"
              alt="Maksuz"
              fill
              className="object-contain"
            />
          </div>

          <span
            className={cn(
              "font-oswald text-3xl font-semibold tracking-wide uppercase mb-12 transition-all duration-700 ease-out",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{ transitionDelay: "400ms" }}
          >
            Maksuz
          </span>

          {/* Testimonial - Bigger */}
          <blockquote
            className={cn(
              "space-y-4 transition-all duration-700 ease-out",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
            style={{ transitionDelay: "600ms" }}
          >
            <p className="font-poppins text-2xl md:text-3xl font-light leading-relaxed">
              &ldquo;Vaš račun je skoro spreman! Dodajte broj telefona kako
              bismo vas mogli kontaktirati oko vaših narudžbi.&rdquo;
            </p>
            <footer className="font-inter text-base text-zinc-300">
              — Maksuz Tim
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[440px] space-y-6">
          {/* Mobile Logo */}
          <div
            className={cn(
              "flex lg:hidden flex-col items-center gap-2 mb-8 transition-all duration-500 ease-out",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            )}
          >
            <div className="relative w-16 h-16">
              <Image
                src="/MAKSUZ_mix_logo.png"
                alt="Maksuz"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-oswald text-xl font-semibold tracking-wide uppercase">
              Maksuz
            </span>
          </div>

          {/* Header with Logo */}
          <div className="flex flex-col items-center space-y-4 text-center">
            {/* Success Icon */}
            <div
              className={cn(
                "w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center transition-all duration-500 ease-out",
                mounted ? "opacity-100 scale-100" : "opacity-0 scale-75"
              )}
              style={{ transitionDelay: "150ms" }}
            >
              <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>

            <div className="space-y-3">
              <p
                className={cn(
                  "font-oswald text-base uppercase tracking-widest text-brand-orange transition-all duration-500 ease-out",
                  mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-3"
                )}
                style={{ transitionDelay: "200ms" }}
              >
                Račun kreiran
              </p>
              <h1
                className={cn(
                  "font-poppins text-3xl font-semibold tracking-tight transition-all duration-500 ease-out",
                  mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-3"
                )}
                style={{ transitionDelay: "300ms" }}
              >
                Dobrodošli, {userName}!
              </h1>
              <p
                className={cn(
                  "font-inter text-sm text-muted-foreground transition-all duration-500 ease-out",
                  mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-3"
                )}
                style={{ transitionDelay: "400ms" }}
              >
                Dopunite profil za bolje iskustvo
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg animate-in fade-in-0 slide-in-from-top-2 duration-300">
              <p className="font-inter text-sm text-destructive text-center">
                {error}
              </p>
            </div>
          )}

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div
                className={cn(
                  "transition-all duration-500 ease-out",
                  mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: "450ms" }}
              >
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-inter">
                        Broj telefona
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            type="tel"
                            placeholder="+387 61 123 456"
                            autoComplete="tel"
                            disabled={isSubmitting}
                            className="pl-11 font-inter"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="font-inter text-xs">
                        Opciono - koristimo za kontakt oko narudžbi
                      </FormDescription>
                      <FormMessage className="font-inter text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <div
                className={cn(
                  "space-y-3 transition-all duration-500 ease-out",
                  mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: "550ms" }}
              >
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 font-inter"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Spremi i nastavi
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 font-inter text-muted-foreground">
                      Ili
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSkip}
                  disabled={isSubmitting}
                  className="w-full h-11 font-inter"
                >
                  <SkipForward className="w-4 h-4 mr-2" />
                  Preskoči za sada
                </Button>
              </div>
            </form>
          </Form>

          {/* Info */}
          <p
            className={cn(
              "px-8 text-center font-inter text-xs text-muted-foreground transition-all duration-500 ease-out",
              mounted ? "opacity-100" : "opacity-0"
            )}
            style={{ transitionDelay: "650ms" }}
          >
            Možete dopuniti profil kasnije u postavkama računa.
          </p>
        </div>
      </div>
    </div>
  );
}
