"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
// Google OAuth - to be implemented
const signIn = (...args: any[]) => { console.log("OAuth:", args); };
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
import {
  useLogin,
  useResendVerificationEmail,
  UnverifiedAccountError,
} from "@/hooks/useAuthMutations";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  AlertTriangle,
  LogIn,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Unesite ispravnu email adresu"),
  password: z.string().min(1, "Lozinka je obavezna"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Get redirect from URL params, or null to use role-based redirect
  const redirectUrl = searchParams.get("redirect");
  const loginMutation = useLogin(redirectUrl || undefined);
  const resendVerificationMutation = useResendVerificationEmail();
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    setUnverifiedEmail(null); // Reset unverified state
    loginMutation.mutate(values, {
      onError: (error) => {
        if (error instanceof UnverifiedAccountError) {
          setUnverifiedEmail(error.email);
        }
      },
    });
  };

  const handleResendVerification = () => {
    if (unverifiedEmail) {
      resendVerificationMutation.mutate(unverifiedEmail);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: redirectUrl || undefined });
    } catch (error) {
      console.error("Google sign-in error:", error);
      setIsGoogleLoading(false);
    }
  };

  const isUnverifiedError = unverifiedEmail !== null;

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
          <Link
            href="/"
            className={cn(
              "relative w-40 h-40 mb-6 transition-all duration-700 ease-out block",
              mounted ? "opacity-100 scale-100" : "opacity-0 scale-75"
            )}
            style={{ transitionDelay: "200ms" }}
          >
            <Image
              src="/SHOPKIT_mix_logo.png"
              alt="ShopKit"
              fill
              className="object-contain"
            />
          </Link>

          <span
            className={cn(
              "font-oswald text-3xl font-semibold tracking-wide uppercase mb-12 transition-all duration-700 ease-out",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{ transitionDelay: "400ms" }}
          >
            ShopKit
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
              &ldquo;Pratite svoje narudžbe, upravljajte plaćanjima i imajte
              uvid u sve transakcije na jednom mjestu.&rdquo;
            </p>
            <footer className="font-inter text-base text-zinc-300">
              — ShopKit Tim
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[440px] space-y-6">
          {/* Mobile Logo */}
          <Link
            href="/"
            className={cn(
              "flex lg:hidden flex-col items-center gap-2 mb-8 transition-all duration-500 ease-out",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            )}
          >
            <div className="relative w-16 h-16">
              <Image
                src="/SHOPKIT_mix_logo.png"
                alt="ShopKit"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-oswald text-xl font-semibold tracking-wide uppercase">
              ShopKit
            </span>
          </Link>

          {/* Header with Logo */}
          <div className="flex flex-col items-center space-y-4 text-center">
            {/* Logo on right side (desktop) */}
            <Link
              href="/"
              className={cn(
                "hidden lg:block relative w-14 h-14 mb-2 transition-all duration-500 ease-out",
                mounted ? "opacity-100 scale-100" : "opacity-0 scale-75"
              )}
              style={{ transitionDelay: "100ms" }}
            >
              <Image
                src="/shopkitorangelogo.png"
                alt="ShopKit"
                fill
                className="object-contain"
              />
            </Link>
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
                Admin Panel
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
                Prijavite se na račun
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
                Unesite email ispod za pristup
              </p>
            </div>
          </div>

          {/* Unverified Account Message */}
          {isUnverifiedError && (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg animate-in fade-in-0 slide-in-from-top-2 duration-300">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 space-y-2">
                  <p className="font-inter text-sm font-medium text-amber-800 dark:text-amber-200">
                    Račun nije verificiran
                  </p>
                  <p className="font-inter text-sm text-amber-700 dark:text-amber-300">
                    Provjerite email za verifikacijski link ili kliknite ispod
                    da pošaljete novi.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleResendVerification}
                    disabled={resendVerificationMutation.isPending}
                    className="mt-2 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/40"
                  >
                    {resendVerificationMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Mail className="w-4 h-4 mr-2" />
                    )}
                    Pošalji verifikacijski email
                  </Button>
                  {resendVerificationMutation.isSuccess && (
                    <p className="font-inter text-xs text-green-600 dark:text-green-400 mt-1">
                      ✓ Verifikacijski email je poslan!
                    </p>
                  )}
                  {resendVerificationMutation.isError && (
                    <p className="font-inter text-xs text-destructive mt-1">
                      {resendVerificationMutation.error?.message ||
                        "Greška pri slanju emaila"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Error Message (non-verification errors) */}
          {loginMutation.isError && !isUnverifiedError && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg animate-in fade-in-0 slide-in-from-top-2 duration-300">
              <p className="font-inter text-sm text-destructive text-center">
                {loginMutation.error?.message || "Pogrešan email ili lozinka"}
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
                            disabled={loginMutation.isPending}
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
                            autoComplete="current-password"
                            disabled={loginMutation.isPending}
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
                  disabled={loginMutation.isPending}
                  className="w-full h-11 font-inter"
                >
                  {loginMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <LogIn className="w-4 h-4 mr-2" />
                  )}
                  Prijavi se putem Email-a
                </Button>
              </div>
            </form>
          </Form>

          {/* Divider */}
          <div
            className={cn(
              "relative transition-all duration-500 ease-out",
              mounted ? "opacity-100" : "opacity-0"
            )}
            style={{ transitionDelay: "700ms" }}
          >
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 font-inter text-muted-foreground">
                Ili nastavite sa
              </span>
            </div>
          </div>

          {/* Social Login - Google */}
          <div
            className={cn(
              "transition-all duration-500 ease-out",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{ transitionDelay: "750ms" }}
          >
            <Button
              variant="outline"
              type="button"
              className="w-full h-11 font-inter"
              onClick={handleGoogleSignIn}
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
              Prijavi se putem Google-a
            </Button>
          </div>

          {/* Footer Links */}
          <div
            className={cn(
              "text-center space-y-4 transition-all duration-500 ease-out",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{ transitionDelay: "850ms" }}
          >
            <Link
              href="/forgot-password"
              className="font-inter mb-4 text-sm text-muted-foreground hover:text-primary underline underline-offset-4"
            >
              Zaboravili ste lozinku?
            </Link>

            {/* Register Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 font-inter text-muted-foreground">
                  Nemate račun?
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full h-11 font-inter"
              onClick={() => router.push("/register")}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Registrujte se
            </Button>
          </div>

          {/* Terms */}
          <p
            className={cn(
              "px-8 text-center font-inter text-xs text-muted-foreground transition-all duration-500 ease-out",
              mounted ? "opacity-100" : "opacity-0"
            )}
            style={{ transitionDelay: "950ms" }}
          >
            Klikom na prijavu prihvatate naše{" "}
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

export default function LoginPageClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
