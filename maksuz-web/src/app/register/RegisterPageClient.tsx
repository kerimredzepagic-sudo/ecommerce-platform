"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRegister } from "@/hooks/useAuthMutations";
import { Loader2, Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "Ime je obavezno"),
    lastName: z.string().min(1, "Prezime je obavezno"),
    email: z.string().email("Unesite ispravnu email adresu"),
    password: z.string().min(6, "Lozinka mora imati najmanje 6 karaktera"),
    confirmPassword: z.string().min(1, "Potvrdite lozinku"),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Lozinke se ne podudaraju",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPageClient() {
  const router = useRouter();
  const registerMutation = useRegister();
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...registerData } = values;
    registerMutation.mutate(registerData, {
      onSuccess: (data) => {
        // Redirect to verify email page with email
        router.push(
          `/verify-email?email=${encodeURIComponent(data.data.email)}`
        );
      },
    });
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/complete-profile" });
    } catch (error) {
      console.error("Google sign-up error:", error);
      setIsGoogleLoading(false);
    }
  };

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
          {/* Logo */}
          <div
            className={cn(
              "relative w-40 h-40 mb-6 transition-all duration-700 ease-out",
              mounted ? "opacity-100 scale-100" : "opacity-0 scale-75"
            )}
            style={{ transitionDelay: "200ms" }}
          >
            <Image
              src="/maksuzorangelogo.png"
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

          {/* Info Text */}
          <blockquote
            className={cn(
              "space-y-4 transition-all duration-700 ease-out",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
            style={{ transitionDelay: "600ms" }}
          >
            <p className="font-poppins text-2xl md:text-3xl font-light leading-relaxed">
              &ldquo;Kreirajte račun i pratite svoje narudžbe, status dostave i
              historiju kupovine na jednom mjestu.&rdquo;
            </p>
            <footer className="font-inter text-base text-zinc-300">
              — Maksuz Tim
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[440px] space-y-5">
          {/* Mobile Logo */}
          <div
            className={cn(
              "flex lg:hidden flex-col items-center gap-2 mb-6 transition-all duration-500 ease-out",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            )}
          >
            <div className="relative w-16 h-16">
              <Image
                src="/maksuzorangelogo.png"
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
            {/* Logo on right side (desktop) */}
            <div
              className={cn(
                "hidden lg:block relative w-14 h-14 mb-2 transition-all duration-500 ease-out",
                mounted ? "opacity-100 scale-100" : "opacity-0 scale-75"
              )}
              style={{ transitionDelay: "100ms" }}
            >
              <Image
                src="/maksuzorangelogo.png"
                alt="Maksuz"
                fill
                className="object-contain"
              />
            </div>
            <div className="space-y-2">
              <p
                className={cn(
                  "font-oswald text-base uppercase tracking-widest text-brand-orange transition-all duration-500 ease-out",
                  mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-3"
                )}
                style={{ transitionDelay: "200ms" }}
              >
                Korisnički račun
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
                Kreirajte račun
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
                Unesite podatke za kreiranje računa
              </p>
            </div>
          </div>

          {/* Google Sign Up Button - at top for visibility */}
          <div
            className={cn(
              "transition-all duration-500 ease-out",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{ transitionDelay: "420ms" }}
          >
            <Button
              variant="outline"
              type="button"
              className="w-full h-11 font-inter"
              onClick={handleGoogleSignUp}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              Registruj se putem Google-a
            </Button>
          </div>

          {/* Divider */}
          <div
            className={cn(
              "relative transition-all duration-500 ease-out",
              mounted ? "opacity-100" : "opacity-0"
            )}
            style={{ transitionDelay: "440ms" }}
          >
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 font-inter text-muted-foreground">
                Ili sa email-om
              </span>
            </div>
          </div>

          {/* Error Message */}
          {registerMutation.isError && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg animate-in fade-in-0 slide-in-from-top-2 duration-300">
              <p className="font-inter text-sm text-destructive text-center">
                {registerMutation.error?.message || "Greška pri registraciji"}
              </p>
            </div>
          )}

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Fields */}
              <div
                className={cn(
                  "grid grid-cols-2 gap-3 transition-all duration-500 ease-out",
                  mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: "450ms" }}
              >
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Ime</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder="Ime"
                            autoComplete="given-name"
                            disabled={registerMutation.isPending}
                            className="pl-11 font-inter"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="font-inter text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Prezime</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder="Prezime"
                            autoComplete="family-name"
                            disabled={registerMutation.isPending}
                            className="pl-11 font-inter"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="font-inter text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email */}
              <div
                className={cn(
                  "transition-all duration-500 ease-out",
                  mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: "500ms" }}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="ime@primjer.com"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={registerMutation.isPending}
                            className="pl-11 font-inter"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="font-inter text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Phone */}
              <div
                className={cn(
                  "transition-all duration-500 ease-out",
                  mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: "550ms" }}
              >
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Telefon</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            type="tel"
                            placeholder="Telefon (opciono)"
                            autoComplete="tel"
                            disabled={registerMutation.isPending}
                            className="pl-11 font-inter"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="font-inter text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Password */}
              <div
                className={cn(
                  "transition-all duration-500 ease-out",
                  mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: "600ms" }}
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Lozinka</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Lozinka"
                            autoComplete="new-password"
                            disabled={registerMutation.isPending}
                            className="pl-11 pr-11 font-inter"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="font-inter text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Confirm Password */}
              <div
                className={cn(
                  "transition-all duration-500 ease-out",
                  mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: "650ms" }}
              >
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Potvrdi lozinku</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Potvrdi lozinku"
                            autoComplete="new-password"
                            disabled={registerMutation.isPending}
                            className="pl-11 pr-11 font-inter"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="font-inter text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <div
                className={cn(
                  "transition-all duration-500 ease-out",
                  mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: "700ms" }}
              >
                <Button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="w-full h-11 font-inter"
                >
                  {registerMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Kreiraj račun
                </Button>
              </div>
            </form>
          </Form>

          {/* Footer Links */}
          <div
            className={cn(
              "text-center space-y-3 transition-all duration-500 ease-out",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{ transitionDelay: "850ms" }}
          >
            <p className="font-inter text-sm text-muted-foreground">
              Već imate račun?
            </p>
            <Button
              variant="outline"
              className="font-inter"
              onClick={() => router.push("/login")}
            >
              Prijavite se
            </Button>
          </div>

          {/* Terms */}
          <p
            className={cn(
              "px-4 text-center font-inter text-xs text-muted-foreground transition-all duration-500 ease-out",
              mounted ? "opacity-100" : "opacity-0"
            )}
            style={{ transitionDelay: "900ms" }}
          >
            Kreiranjem računa prihvatate naše{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Uslove korištenja
            </Link>{" "}
            i{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Politiku privatnosti
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
