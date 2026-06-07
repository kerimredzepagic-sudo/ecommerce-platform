"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useResetPassword } from "@/hooks/useAuthMutations";
import {
  Loader2,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Lozinka mora imati najmanje 6 karaktera")
      .max(100, "Lozinka je predugačka"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Lozinke se ne podudaraju",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const resetPasswordMutation = useResetPassword();

  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = form.watch("password");

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 6) strength++;
    if (pass.length >= 8) strength++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++;
    if (/\d/.test(pass)) strength++;
    if (/[^a-zA-Z0-9]/.test(pass)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthLabels = [
    "Vrlo slaba",
    "Slaba",
    "Srednja",
    "Jaka",
    "Vrlo jaka",
  ];
  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
  ];

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      await resetPasswordMutation.mutateAsync({
        token,
        password: values.password,
      });
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Token nije pronađen.</p>
          <Link
            href="/forgot-password"
            className="text-brand-orange hover:underline"
          >
            Zatražite novi kod
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 overflow-hidden">
      {/* Left Side - Video Background */}
      <div className="relative hidden lg:flex flex-col items-center justify-center p-10 text-white overflow-hidden">
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

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />

        <div className="relative z-20 flex flex-col items-center text-center max-w-lg">
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

          <blockquote
            className={cn(
              "space-y-4 transition-all duration-700 ease-out",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
            style={{ transitionDelay: "600ms" }}
          >
            <p className="font-poppins text-2xl md:text-3xl font-light leading-relaxed">
              &ldquo;Kreirajte sigurnu lozinku koju ćete lako zapamtiti.&rdquo;
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

          {/* Back Link */}
          {!success && (
            <div
              className={cn(
                "transition-all duration-500 ease-out",
                mounted
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-4"
              )}
              style={{ transitionDelay: "100ms" }}
            >
              <Link
                href="/forgot-password"
                className="inline-flex items-center gap-2 font-inter text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Počni ispočetka
              </Link>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col items-center space-y-4 text-center">
            <div
              className={cn(
                "hidden lg:block relative w-14 h-14 mb-2 transition-all duration-500 ease-out",
                mounted ? "opacity-100 scale-100" : "opacity-0 scale-75"
              )}
              style={{ transitionDelay: "150ms" }}
            >
              <Image
                src="/maksuzorangelogo.png"
                alt="Maksuz"
                fill
                className="object-contain"
              />
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
                {success ? "Uspješno" : "Zadnji korak"}
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
                {success ? "Lozinka resetovana!" : "Nova lozinka"}
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
                {success
                  ? "Preusmjeravamo vas na stranicu za prijavu..."
                  : "Unesite novu lozinku za vaš račun"}
              </p>
            </div>
          </div>

          {/* Error Message */}
          {resetPasswordMutation.isError && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg animate-in fade-in-0 slide-in-from-top-2 duration-300">
              <p className="font-inter text-sm text-destructive text-center">
                {resetPasswordMutation.error?.message ||
                  "Greška pri resetovanju lozinke"}
              </p>
            </div>
          )}

          {/* Success State */}
          {success ? (
            <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
              </div>

              <Button
                onClick={() => router.push("/login")}
                className="w-full h-11 font-inter"
              >
                Prijavi se odmah
              </Button>
            </div>
          ) : (
            /* Form */
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Nova lozinka</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Nova lozinka"
                              autoComplete="new-password"
                              disabled={resetPasswordMutation.isPending}
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

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="mt-2 space-y-1 animate-in fade-in-0 duration-200">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              "h-1 flex-1 rounded-full transition-colors duration-300",
                              i < passwordStrength
                                ? strengthColors[passwordStrength - 1]
                                : "bg-gray-200"
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Jačina:{" "}
                        {strengthLabels[passwordStrength - 1] || "Vrlo slaba"}
                      </p>
                    </div>
                  )}
                </div>

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
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">
                          Potvrdi lozinku
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Potvrdi lozinku"
                              autoComplete="new-password"
                              disabled={resetPasswordMutation.isPending}
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

                <div
                  className={cn(
                    "transition-all duration-500 ease-out",
                    mounted
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  )}
                  style={{ transitionDelay: "650ms" }}
                >
                  <Button
                    type="submit"
                    disabled={resetPasswordMutation.isPending}
                    className="w-full h-11 font-inter"
                  >
                    {resetPasswordMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Resetuj lozinku
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPageClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
