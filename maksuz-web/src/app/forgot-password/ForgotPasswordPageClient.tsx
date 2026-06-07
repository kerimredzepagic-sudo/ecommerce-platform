"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import { useForgotPassword } from "@/hooks/useAuthMutations";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const forgotPasswordSchema = z.object({
  email: z.string().email("Unesite ispravnu email adresu"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPageClient() {
  const router = useRouter();
  const forgotPasswordMutation = useForgotPassword();
  const [mounted, setMounted] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await forgotPasswordMutation.mutateAsync(values.email);
      setSubmittedEmail(values.email);
      setEmailSent(true);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleContinue = () => {
    router.push(`/verify-code?email=${encodeURIComponent(submittedEmail)}`);
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
              &ldquo;Sigurnost vašeg računa je naš prioritet. Pratimo najbolje
              prakse zaštite podataka.&rdquo;
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
          <div
            className={cn(
              "transition-all duration-500 ease-out",
              mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
            )}
            style={{ transitionDelay: "100ms" }}
          >
            <Link
              href="/login"
              className="inline-flex items-center gap-2 font-inter text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Nazad na prijavu
            </Link>
          </div>

          {/* Header with Logo */}
          <div className="flex flex-col items-center space-y-4 text-center">
            {/* Logo on right side (desktop) */}
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
                Resetovanje lozinke
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
                {emailSent ? "Provjerite email" : "Zaboravili ste lozinku?"}
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
                {emailSent
                  ? `Poslali smo 6-cifreni kod na ${submittedEmail}`
                  : "Unesite email za primanje koda za resetovanje"}
              </p>
            </div>
          </div>

          {/* Error Message */}
          {forgotPasswordMutation.isError && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg animate-in fade-in-0 slide-in-from-top-2 duration-300">
              <p className="font-inter text-sm text-destructive text-center">
                {forgotPasswordMutation.error?.message ||
                  "Greška pri slanju emaila"}
              </p>
            </div>
          )}

          {/* Success State */}
          {emailSent ? (
            <div
              className={cn(
                "space-y-6 transition-all duration-500 ease-out",
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              )}
            >
              {/* Success Icon */}
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <Button
                onClick={handleContinue}
                className="w-full h-11 font-inter"
              >
                Unesi kod
              </Button>

              <p className="text-center font-inter text-sm text-muted-foreground">
                Niste primili email?{" "}
                <button
                  type="button"
                  onClick={() => onSubmit({ email: submittedEmail })}
                  disabled={forgotPasswordMutation.isPending}
                  className="text-brand-orange hover:underline"
                >
                  Pošalji ponovo
                </button>
              </p>
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
                              disabled={forgotPasswordMutation.isPending}
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

                <div
                  className={cn(
                    "transition-all duration-500 ease-out",
                    mounted
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  )}
                  style={{ transitionDelay: "550ms" }}
                >
                  <Button
                    type="submit"
                    disabled={forgotPasswordMutation.isPending}
                    className="w-full h-11 font-inter"
                  >
                    {forgotPasswordMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Pošalji kod
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {/* Footer Links */}
          <div
            className={cn(
              "text-center transition-all duration-500 ease-out",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{ transitionDelay: "650ms" }}
          >
            <p className="font-inter text-sm text-muted-foreground">
              Sjetili ste se lozinke?{" "}
              <Link
                href="/login"
                className="underline underline-offset-4 hover:text-primary"
              >
                Prijavite se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
