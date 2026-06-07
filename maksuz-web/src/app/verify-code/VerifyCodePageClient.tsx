"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useVerifyCode, useForgotPassword } from "@/hooks/useAuthMutations";
import { Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

function VerifyCodeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const verifyCodeMutation = useVerifyCode();
  const resendMutation = useForgotPassword();

  const [mounted, setMounted] = useState(false);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
    // Focus first input on mount
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 500);
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleInputChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits entered
    if (newCode.every((digit) => digit !== "") && value) {
      handleSubmit(newCode.join(""));
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pastedData.length === 6) {
      const newCode = pastedData.split("");
      setCode(newCode);
      inputRefs.current[5]?.focus();
      handleSubmit(pastedData);
    }
  };

  const handleSubmit = async (codeString: string) => {
    try {
      const result = await verifyCodeMutation.mutateAsync({
        email,
        code: codeString,
      });
      if (result.token) {
        router.push(
          `/reset-password?token=${encodeURIComponent(result.token)}`
        );
      }
    } catch (error) {
      // Clear code on error
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    try {
      await resendMutation.mutateAsync(email);
      setResendCooldown(60);
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Email nije pronađen.</p>
          <Link
            href="/forgot-password"
            className="text-brand-orange hover:underline"
          >
            Nazad na resetovanje lozinke
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
              &ldquo;Unesite 6-cifreni kod koji smo vam poslali na email.&rdquo;
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
              href="/forgot-password"
              className="inline-flex items-center gap-2 font-inter text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Nazad
            </Link>
          </div>

          {/* Header */}
          <div className="flex flex-col items-center space-y-4 text-center">
            <div
              className={cn(
                "hidden lg:flex w-16 h-16 rounded-full bg-brand-orange/10 items-center justify-center transition-all duration-500 ease-out",
                mounted ? "opacity-100 scale-100" : "opacity-0 scale-75"
              )}
              style={{ transitionDelay: "150ms" }}
            >
              <ShieldCheck className="w-8 h-8 text-brand-orange" />
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
                Verifikacija
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
                Unesite kod
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
                Poslali smo 6-cifreni kod na <br />
                <span className="font-medium text-foreground">{email}</span>
              </p>
            </div>
          </div>

          {/* Error Message */}
          {verifyCodeMutation.isError && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg animate-in fade-in-0 slide-in-from-top-2 duration-300">
              <p className="font-inter text-sm text-destructive text-center">
                {verifyCodeMutation.error?.message ||
                  "Neispravan ili istekao kod"}
              </p>
            </div>
          )}

          {/* Code Inputs */}
          <div
            className={cn(
              "flex justify-center gap-3 transition-all duration-500 ease-out",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{ transitionDelay: "450ms" }}
          >
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                disabled={verifyCodeMutation.isPending}
                className={cn(
                  "w-12 h-14 text-center text-2xl font-bold rounded-lg border-2 bg-background",
                  "transition-all duration-300 ease-in-out",
                  "focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange",
                  "hover:border-brand-orange/50",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  digit ? "border-brand-orange" : "border-input"
                )}
              />
            ))}
          </div>

          {/* Submit Button */}
          <div
            className={cn(
              "transition-all duration-500 ease-out",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{ transitionDelay: "550ms" }}
          >
            <Button
              onClick={() => handleSubmit(code.join(""))}
              disabled={verifyCodeMutation.isPending || code.some((d) => !d)}
              className="w-full h-11 font-inter"
            >
              {verifyCodeMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Potvrdi kod
            </Button>
          </div>

          {/* Resend Code */}
          <div
            className={cn(
              "text-center transition-all duration-500 ease-out",
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{ transitionDelay: "650ms" }}
          >
            <p className="font-inter text-sm text-muted-foreground">
              Niste primili kod?{" "}
              {resendCooldown > 0 ? (
                <span className="text-muted-foreground">
                  Pošalji ponovo za {resendCooldown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendMutation.isPending}
                  className="text-brand-orange hover:underline disabled:opacity-50"
                >
                  {resendMutation.isPending ? "Šalje se..." : "Pošalji ponovo"}
                </button>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyCodePageClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <VerifyCodeForm />
    </Suspense>
  );
}
