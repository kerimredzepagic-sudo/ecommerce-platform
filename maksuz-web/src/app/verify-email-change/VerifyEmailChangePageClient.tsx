"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, Mail, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function VerifyEmailChangeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [verificationState, setVerificationState] = useState<
    "loading" | "success" | "error" | "no-token"
  >("loading");
  const [newEmail, setNewEmail] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!token) {
      setVerificationState("no-token");
      return;
    }

    const verifyEmailChange = async () => {
      try {
        const response = await fetch(`${API_BASE}/auth/verify-email-change`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setNewEmail(data.data?.newEmail || "");
          setVerificationState("success");
        } else {
          setErrorMessage(data.error || "Verifikacija nije uspjela");
          setVerificationState("error");
        }
      } catch {
        setErrorMessage("Greška prilikom verifikacije. Pokušajte ponovo.");
        setVerificationState("error");
      }
    };

    verifyEmailChange();
  }, [token]);

  const renderContent = () => {
    if (verificationState === "loading" && token) {
      return (
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-16 h-16 animate-spin text-brand-orange" />
          <h1 className="font-poppins text-2xl font-semibold">Verifikacija u toku...</h1>
          <p className="font-inter text-muted-foreground text-center">
            Molimo pričekajte dok verifikujemo promjenu email adrese.
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
            Email Adresa Promijenjena!
          </h1>
          <p className="font-inter text-muted-foreground text-center max-w-sm">
            Vaša email adresa je uspješno promijenjena
            {newEmail && (
              <>
                {" "}
                u <strong className="text-foreground">{newEmail}</strong>
              </>
            )}
            . Koristite novu adresu za prijavu.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs mt-4">
            <Button
              onClick={() => router.push("/login")}
              className="flex-1 h-11 font-inter bg-brand-orange hover:bg-brand-orange/90"
            >
              Prijavi se
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
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
            {errorMessage || "Verifikacijski link je neispravan ili je istekao."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs mt-4">
            <Button
              variant="outline"
              onClick={() => router.push("/account/settings")}
              className="flex-1 h-11 font-inter"
            >
              Nazad na postavke
            </Button>
          </div>
        </div>
      );
    }

    // No token provided
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
          <Mail className="w-12 h-12 text-amber-600 dark:text-amber-500" />
        </div>
        <h1 className="font-poppins text-2xl font-semibold">Neispravan Link</h1>
        <p className="font-inter text-muted-foreground text-center max-w-sm">
          Ovaj link nije ispravan. Provjerite da li ste kliknuli na ispravan link iz emaila.
        </p>
        <Button
          variant="outline"
          onClick={() => router.push("/account/settings")}
          className="h-11 font-inter mt-4"
        >
          Nazad na postavke
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Video Background */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] ease-out",
            mounted ? "scale-100" : "scale-110"
          )}
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />

        {/* Logo on video side */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <Link href="/">
            <Image
              src="/maksuzorangelogo.png"
              alt="Maksuz"
              width={180}
              height={180}
              className={cn(
                "transition-all duration-1000 ease-out",
                mounted ? "opacity-100 scale-100" : "opacity-0 scale-90"
              )}
              priority
            />
          </Link>
        </div>
      </div>

      {/* Right Side - Content */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/">
              <Image
                src="/maksuzorangelogo.png"
                alt="Maksuz"
                width={80}
                height={80}
                priority
              />
            </Link>
          </div>

          {/* Content Card */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
            {renderContent()}
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            © {new Date().getFullYear()} Maksuz. Sva prava zadržana.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailChangePageClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="w-12 h-12 animate-spin text-brand-orange" />
        </div>
      }
    >
      <VerifyEmailChangeContent />
    </Suspense>
  );
}

