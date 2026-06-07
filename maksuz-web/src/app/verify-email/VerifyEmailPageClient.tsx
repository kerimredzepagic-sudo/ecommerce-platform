"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, Mail } from "lucide-react";
import {
  useVerifyEmail,
  useResendVerificationEmail,
} from "@/hooks/useAuthMutations";
import { cn } from "@/lib/utils";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const verifyMutation = useVerifyEmail();
  const resendMutation = useResendVerificationEmail();

  const [verificationState, setVerificationState] = useState<
    "loading" | "success" | "error" | "no-token"
  >("loading");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (token) {
      verifyMutation.mutate(token, {
        onSuccess: () => {
          setVerificationState("success");
        },
        onError: () => {
          setVerificationState("error");
        },
      });
    } else if (email) {
      // Just showing resend option when coming from register
      setVerificationState("no-token");
    } else {
      setVerificationState("no-token");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, email]);

  const handleResend = () => {
    if (email) {
      resendMutation.mutate(email);
    }
  };

  const renderContent = () => {
    if (verificationState === "loading" && token) {
      return (
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-16 h-16 animate-spin text-brand-orange" />
          <h1 className="font-poppins text-2xl font-semibold">
            Verifikacija u toku...
          </h1>
          <p className="font-inter text-muted-foreground text-center">
            Molimo pričekajte dok verifikujemo vašu email adresu.
          </p>
        </div>
      );
    }

    if (verificationState === "success") {
      return (
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-500" />
          </div>
          <h1 className="font-poppins text-2xl font-semibold text-green-600 dark:text-green-500">
            Email Verificiran!
          </h1>
          <p className="font-inter text-muted-foreground text-center max-w-sm">
            Vaša email adresa je uspješno verificirana. Sada se možete prijaviti
            na svoj račun.
          </p>
          <Button
            onClick={() => router.push("/login")}
            className="w-full max-w-xs h-11 font-inter mt-4"
          >
            Prijavi se
          </Button>
        </div>
      );
    }

    if (verificationState === "error") {
      return (
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <XCircle className="w-12 h-12 text-red-600 dark:text-red-500" />
          </div>
          <h1 className="font-poppins text-2xl font-semibold text-red-600 dark:text-red-500">
            Verifikacija Nije Uspjela
          </h1>
          <p className="font-inter text-muted-foreground text-center max-w-sm">
            {verifyMutation.error?.message ||
              "Verifikacijski link je neispravan ili je istekao."}
          </p>
          {email && (
            <Button
              onClick={handleResend}
              disabled={resendMutation.isPending}
              variant="outline"
              className="w-full max-w-xs h-11 font-inter mt-4"
            >
              {resendMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Mail className="w-4 h-4 mr-2" />
              )}
              Pošalji novi verifikacijski link
            </Button>
          )}
          {resendMutation.isSuccess && (
            <p className="font-inter text-sm text-green-600">
              ✓ Novi verifikacijski email je poslan!
            </p>
          )}
          <Link
            href="/register"
            className="font-inter text-sm text-muted-foreground hover:text-primary underline underline-offset-4 mt-2"
          >
            Nazad na registraciju
          </Link>
        </div>
      );
    }

    // No token - show waiting for verification or resend option
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="w-20 h-20 bg-brand-orange/10 rounded-full flex items-center justify-center">
          <Mail className="w-12 h-12 text-brand-orange" />
        </div>
        <h1 className="font-poppins text-2xl font-semibold">
          Provjerite Email
        </h1>
        <p className="font-inter text-muted-foreground text-center max-w-sm">
          {email ? (
            <>
              Poslali smo verifikacijski link na{" "}
              <span className="font-medium text-foreground">{email}</span>.
              <br />
              Kliknite na link u emailu da aktivirate svoj račun.
            </>
          ) : (
            "Provjerite svoj email za verifikacijski link."
          )}
        </p>

        {email && (
          <>
            <div className="pt-4 w-full max-w-xs">
              <Button
                onClick={handleResend}
                disabled={resendMutation.isPending}
                variant="outline"
                className="w-full h-11 font-inter"
              >
                {resendMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Mail className="w-4 h-4 mr-2" />
                )}
                Pošalji ponovo
              </Button>
            </div>
            {resendMutation.isSuccess && (
              <p className="font-inter text-sm text-green-600">
                ✓ Novi verifikacijski email je poslan!
              </p>
            )}
            {resendMutation.isError && (
              <p className="font-inter text-sm text-red-600">
                {resendMutation.error?.message || "Greška pri slanju emaila"}
              </p>
            )}
          </>
        )}

        <div className="flex flex-col items-center gap-2 pt-4">
          <Link
            href="/login"
            className="font-inter text-sm text-primary hover:underline underline-offset-4"
          >
            Nazad na prijavu
          </Link>
        </div>
      </div>
    );
  };

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
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            )}
            style={{ transitionDelay: "400ms" }}
          >
            Maksuz
          </span>

          <blockquote
            className={cn(
              "space-y-4 transition-all duration-700 ease-out",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            )}
            style={{ transitionDelay: "600ms" }}
          >
            <p className="font-poppins text-2xl md:text-3xl font-light leading-relaxed">
              &ldquo;Samo još jedan korak do vašeg računa!&rdquo;
            </p>
            <footer className="font-inter text-base text-zinc-300">
              — Maksuz Tim
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right Side - Content */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[440px] space-y-6">
          {/* Mobile Logo */}
          <div className="flex lg:hidden flex-col items-center gap-2 mb-8">
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

          {/* Desktop Logo */}
          <div className="hidden lg:flex flex-col items-center mb-8">
            <div className="relative w-14 h-14 mb-2">
              <Image
                src="/maksuzorangelogo.png"
                alt="Maksuz"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPageClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
