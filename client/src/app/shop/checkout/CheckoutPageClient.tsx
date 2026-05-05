"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  ShoppingBag,
  CreditCard,
  Truck,
  ChevronLeft,
  ChevronRight,
  Loader2,
  User,
  Lock,
  Tag,
  X,
  CheckCircle,
  Check,
  MapPin,
  Edit2,
  Shield,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Form validation schema
const checkoutSchema = z.object({
  // Guest fields - optional, only validated when guest checkout
  guestEmail: z
    .string()
    .email("Unesite validnu email adresu")
    .optional()
    .or(z.literal("")),
  guestName: z
    .string()
    .min(2, "Ime mora imati najmanje 2 karaktera")
    .optional()
    .or(z.literal("")),
  // Billing address
  firstName: z.string().min(2, "Ime mora imati najmanje 2 karaktera"),
  lastName: z.string().min(2, "Prezime mora imati najmanje 2 karaktera"),
  street: z.string().min(5, "Unesite punu adresu"),
  city: z.string().min(2, "Unesite grad"),
  postalCode: z.string().min(4, "Unesite poštanski broj"),
  country: z.string().min(2, "Unesite državu"),
  phone: z.string().min(8, "Unesite validan broj telefona"),
  // Shipping address fields (optional, only if different)
  shippingFirstName: z.string().optional(),
  shippingLastName: z.string().optional(),
  shippingStreet: z.string().optional(),
  shippingCity: z.string().optional(),
  shippingPostalCode: z.string().optional(),
  shippingCountry: z.string().optional(),
  shippingPhone: z.string().optional(),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface ShippingSettings {
  flatRate: number;
  freeShippingThreshold: number;
  taxRate: number;
}

interface PromoCodeDiscount {
  code: string;
  type: "percentage" | "fixed" | "free_shipping";
  value: number;
}

// Step indicator component
function StepIndicator({
  currentStep,
  goToStep,
}: {
  currentStep: number;
  goToStep: (step: number) => void;
}) {
  const steps = [
    { number: 1, label: "Informacije", icon: User },
    { number: 2, label: "Plaćanje", icon: CreditCard },
    { number: 3, label: "Pregled", icon: CheckCircle },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-xl mx-auto">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;
          const Icon = step.icon;

          return (
            <div key={step.number} className="flex items-center flex-1">
              <button
                onClick={() => isCompleted && goToStep(step.number)}
                disabled={!isCompleted}
                className={cn(
                  "flex flex-col items-center gap-2 transition-all duration-300",
                  isCompleted && "cursor-pointer",
                  !isCompleted && !isActive && "opacity-50",
                )}
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                    isCompleted && "bg-green-500 border-green-500 text-white",
                    isActive &&
                      "bg-brand-orange border-brand-orange text-white scale-110",
                    !isCompleted &&
                      !isActive &&
                      "bg-gray-100 border-gray-200 text-gray-400",
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={cn(
                    "font-oswald text-sm uppercase tracking-wide",
                    isActive && "text-brand-orange font-bold",
                    isCompleted && "text-green-600",
                    !isCompleted && !isActive && "text-gray-400",
                  )}
                >
                  {step.label}
                </span>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-4 transition-all duration-500",
                    currentStep > step.number ? "bg-green-500" : "bg-gray-200",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CheckoutPageClient() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [checkoutMode, setCheckoutMode] = useState<"guest" | "account">(
    isAuthenticated ? "account" : "guest",
  );
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");
  const [differentShippingAddress, setDifferentShippingAddress] =
    useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Shipping settings
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>({
    flatRate: 5,
    freeShippingThreshold: 50,
    taxRate: 0.17,
  });
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Promo code
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoCodeDiscount | null>(
    null,
  );
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState("");

  // Fetch shipping settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const API_BASE =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const response = await fetch(`${API_BASE}/settings/shipping`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setShippingSettings(data.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch shipping settings:", error);
      } finally {
        setLoadingSettings(false);
      }
    };
    fetchSettings();
  }, []);

  // Calculate totals
  const baseShipping =
    subtotal >= shippingSettings.freeShippingThreshold
      ? 0
      : shippingSettings.flatRate;

  // Apply promo discount
  let promoDiscount = 0;
  let finalShipping = baseShipping;

  if (appliedPromo) {
    if (appliedPromo.type === "percentage") {
      promoDiscount = subtotal * (appliedPromo.value / 100);
    } else if (appliedPromo.type === "fixed") {
      promoDiscount = Math.min(appliedPromo.value, subtotal);
    } else if (appliedPromo.type === "free_shipping") {
      finalShipping = 0;
    }
  }

  const discountedSubtotal = subtotal - promoDiscount;
  const tax = discountedSubtotal * shippingSettings.taxRate;
  const total = discountedSubtotal + finalShipping;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
    getValues,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      guestEmail: user?.email || "",
      guestName: user
        ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
        : "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      country: "Bosna i Hercegovina",
      shippingCountry: "Bosna i Hercegovina",
    },
  });

  // Watch form values for the review step
  const formValues = watch();

  // Pre-fill from saved user address
  useEffect(() => {
    if (isAuthenticated && user) {
      const userWithAddress = user as unknown as {
        address?: {
          street?: string;
          city?: string;
          postalCode?: string;
          country?: string;
        };
        phone?: string;
      };

      if (userWithAddress.address) {
        if (userWithAddress.address.street)
          setValue("street", userWithAddress.address.street);
        if (userWithAddress.address.city)
          setValue("city", userWithAddress.address.city);
        if (userWithAddress.address.postalCode)
          setValue("postalCode", userWithAddress.address.postalCode);
        if (userWithAddress.address.country)
          setValue("country", userWithAddress.address.country);
      }
      if (userWithAddress.phone) setValue("phone", userWithAddress.phone);
    }
  }, [isAuthenticated, user, setValue]);

  // Step navigation
  const goToStep = (step: number) => {
    if (step < currentStep) {
      setCurrentStep(step);
    }
  };

  const nextStep = async () => {
    if (currentStep === 1) {
      // Validate step 1 fields
      const step1Fields: (keyof CheckoutFormData)[] = [
        "firstName",
        "lastName",
        "street",
        "city",
        "postalCode",
        "country",
        "phone",
      ];

      // Add guest fields if in guest mode
      if (checkoutMode === "guest" && !isAuthenticated) {
        step1Fields.push("guestEmail", "guestName");
      }

      // Add shipping fields if different address
      if (differentShippingAddress) {
        step1Fields.push(
          "shippingFirstName",
          "shippingLastName",
          "shippingStreet",
          "shippingCity",
          "shippingPostalCode",
          "shippingCountry",
          "shippingPhone",
        );
      }

      const isValid = await trigger(step1Fields);

      // Additional guest validation
      if (checkoutMode === "guest" && !isAuthenticated) {
        const values = getValues();
        if (!values.guestEmail || !values.guestEmail.includes("@")) {
          toast.error("Unesite validnu email adresu");
          return;
        }
        if (!values.guestName || values.guestName.length < 2) {
          toast.error("Unesite vaše ime");
          return;
        }
      }

      if (isValid) {
        setCurrentStep(2);
      } else {
        toast.error("Molimo popunite sva obavezna polja");
      }
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Apply promo code
  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;

    setPromoLoading(true);
    setPromoError("");

    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${API_BASE}/promo-codes/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode, orderAmount: subtotal }),
      });

      const data = await response.json();

      if (!response.ok) {
        setPromoError(data.message || "Nevažeći promo kod");
        return;
      }

      if (data.success && data.data.valid) {
        setAppliedPromo({
          code: data.data.code.code,
          type: data.data.code.type,
          value: data.data.code.value,
        });
        toast.success("Promo kod primijenjen!");
        setPromoCode("");
      }
    } catch {
      setPromoError("Greška pri validaciji promo koda");
    } finally {
      setPromoLoading(false);
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoError("");
  };

  // If cart is empty, redirect to shop
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="font-oswald text-2xl font-bold text-gray-900 mb-2">
            Vaša korpa je prazna
          </h1>
          <p className="text-gray-500 mb-6">
            Dodajte proizvode u korpu prije nastavka na kasu.
          </p>
          <Link href="/shop/products">
            <Button className="font-oswald uppercase bg-brand-orange hover:bg-brand-orange/90">
              Pregledaj proizvode
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormData) => {
    if (!acceptedTerms) {
      toast.error("Morate prihvatiti uvjete korištenja");
      return;
    }

    setIsSubmitting(true);

    try {
      const API_BASE =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      // Determine shipping address
      const shippingAddress = differentShippingAddress
        ? {
            firstName: data.shippingFirstName || data.firstName,
            lastName: data.shippingLastName || data.lastName,
            street: data.shippingStreet || data.street,
            city: data.shippingCity || data.city,
            postalCode: data.shippingPostalCode || data.postalCode,
            country: data.shippingCountry || data.country,
            phone: data.shippingPhone || data.phone,
          }
        : {
            firstName: data.firstName,
            lastName: data.lastName,
            street: data.street,
            city: data.city,
            postalCode: data.postalCode,
            country: data.country,
            phone: data.phone,
          };

      // Build order payload based on checkout mode
      const isGuestCheckout = !isAuthenticated || checkoutMode === "guest";

      const orderPayload: Record<string, unknown> = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress,
        billingAddress: {
          firstName: data.firstName,
          lastName: data.lastName,
          street: data.street,
          city: data.city,
          postalCode: data.postalCode,
          country: data.country,
        },
        paymentMethod: paymentMethod === "cash" ? "cash_on_delivery" : "card",
        notes: data.notes,
        promoCode: appliedPromo?.code,
      };

      // Only add guest fields for guest checkout
      if (isGuestCheckout) {
        orderPayload.guestEmail = data.guestEmail;
        orderPayload.guestName = data.guestName;
      }

      const endpoint = isGuestCheckout
        ? `${API_BASE}/orders/guest`
        : `${API_BASE}/orders`;

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      // Add auth token for authenticated users (non-guest checkout)
      if (!isGuestCheckout) {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
          headers["Authorization"] = `Bearer ${accessToken}`;
        }
      }

      console.log("Sending order:", { endpoint, orderPayload });

      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(orderPayload),
      });

      const result = await response.json();
      console.log("Order API response:", { status: response.status, result });

      if (!response.ok) {
        console.error("Order creation failed:", result);
        throw new Error(
          result.message || result.error || "Greška pri kreiranju narudžbe",
        );
      }

      // Clear cart and redirect to confirmation
      clearCart();
      toast.success("Narudžba uspješno kreirana!");
      router.push(
        `/shop/order/confirmed?orderNumber=${result.data.orderNumber}`,
      );
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Greška pri kreiranju narudžbe",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingSettings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
      </div>
    );
  }

  // Get shipping address for review
  const getShippingAddress = () => {
    if (differentShippingAddress) {
      return {
        firstName: formValues.shippingFirstName || formValues.firstName,
        lastName: formValues.shippingLastName || formValues.lastName,
        street: formValues.shippingStreet || formValues.street,
        city: formValues.shippingCity || formValues.city,
        postalCode: formValues.shippingPostalCode || formValues.postalCode,
        country: formValues.shippingCountry || formValues.country,
        phone: formValues.shippingPhone || formValues.phone,
      };
    }
    return {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      street: formValues.street,
      city: formValues.city,
      postalCode: formValues.postalCode,
      country: formValues.country,
      phone: formValues.phone,
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/shop/products"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-brand-orange transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="font-oswald text-sm uppercase">Nazad na shop</span>
          </Link>
          <h1 className="font-oswald text-3xl font-bold text-gray-900">
            Završi kupovinu
          </h1>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} goToStep={goToStep} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form Steps */}
            <div className="lg:col-span-2 space-y-6">
              {/* STEP 1: Information */}
              <div
                className={cn(
                  "transition-all duration-500",
                  currentStep === 1 ? "opacity-100 translate-x-0" : "hidden",
                )}
              >
                {/* Checkout Mode Selection */}
                {!isAuthenticated && (
                  <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                    <h2 className="font-oswald text-lg font-bold text-gray-900 mb-4">
                      Način kupovine
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setCheckoutMode("guest")}
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-xl border-2 transition-all",
                          checkoutMode === "guest"
                            ? "border-brand-orange bg-brand-orange/5"
                            : "border-gray-200 hover:border-gray-300",
                        )}
                      >
                        <User className="w-5 h-5 text-gray-600" />
                        <div className="text-left">
                          <p className="font-oswald font-bold text-gray-900">
                            Gost
                          </p>
                          <p className="text-xs text-gray-500">
                            Nastavite bez registracije
                          </p>
                        </div>
                      </button>
                      <Link href="/login?redirect=/shop/checkout">
                        <button
                          type="button"
                          className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all w-full"
                        >
                          <Lock className="w-5 h-5 text-gray-600" />
                          <div className="text-left">
                            <p className="font-oswald font-bold text-gray-900">
                              Prijava
                            </p>
                            <p className="text-xs text-gray-500">
                              Prijavite se na nalog
                            </p>
                          </div>
                        </button>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Guest Info */}
                {checkoutMode === "guest" && !isAuthenticated && (
                  <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                    <h2 className="font-oswald text-lg font-bold text-gray-900 mb-4">
                      Kontakt podaci
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="guestName">Ime i prezime</Label>
                        <Input
                          id="guestName"
                          {...register("guestName")}
                          placeholder="Vaše ime i prezime"
                          className={errors.guestName ? "border-red-500" : ""}
                        />
                        {errors.guestName && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.guestName.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="guestEmail">Email adresa</Label>
                        <Input
                          id="guestEmail"
                          type="email"
                          {...register("guestEmail")}
                          placeholder="vas@email.com"
                          className={errors.guestEmail ? "border-red-500" : ""}
                        />
                        {errors.guestEmail && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.guestEmail.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Billing Address */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="font-oswald text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-brand-orange" />
                    Adresa za račun
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Ime</Label>
                      <Input
                        id="firstName"
                        {...register("firstName")}
                        placeholder="Ime"
                        className={errors.firstName ? "border-red-500" : ""}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Prezime</Label>
                      <Input
                        id="lastName"
                        {...register("lastName")}
                        placeholder="Prezime"
                        className={errors.lastName ? "border-red-500" : ""}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="street">Ulica i broj</Label>
                      <Input
                        id="street"
                        {...register("street")}
                        placeholder="Ulica i kućni broj"
                        className={errors.street ? "border-red-500" : ""}
                      />
                      {errors.street && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.street.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="city">Grad</Label>
                      <Input
                        id="city"
                        {...register("city")}
                        placeholder="Grad"
                        className={errors.city ? "border-red-500" : ""}
                      />
                      {errors.city && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.city.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="postalCode">Poštanski broj</Label>
                      <Input
                        id="postalCode"
                        {...register("postalCode")}
                        placeholder="71000"
                        className={errors.postalCode ? "border-red-500" : ""}
                      />
                      {errors.postalCode && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.postalCode.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="country">Država</Label>
                      <Input
                        id="country"
                        {...register("country")}
                        placeholder="Bosna i Hercegovina"
                        className={errors.country ? "border-red-500" : ""}
                      />
                      {errors.country && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.country.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone">Broj telefona</Label>
                      <Input
                        id="phone"
                        {...register("phone")}
                        placeholder="+387 61 234 567"
                        className={errors.phone ? "border-red-500" : ""}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Different Shipping Address Checkbox */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="differentAddress"
                        checked={differentShippingAddress}
                        onCheckedChange={(checked) =>
                          setDifferentShippingAddress(checked === true)
                        }
                      />
                      <Label
                        htmlFor="differentAddress"
                        className="text-sm font-normal cursor-pointer"
                      >
                        Dostava na drugu adresu
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Shipping Address (conditional) */}
                {differentShippingAddress && (
                  <div className="bg-white rounded-2xl p-6 shadow-sm mt-6">
                    <h2 className="font-oswald text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Truck className="w-5 h-5 text-brand-orange" />
                      Adresa dostave
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="shippingFirstName">Ime</Label>
                        <Input
                          id="shippingFirstName"
                          {...register("shippingFirstName")}
                          placeholder="Ime"
                        />
                      </div>
                      <div>
                        <Label htmlFor="shippingLastName">Prezime</Label>
                        <Input
                          id="shippingLastName"
                          {...register("shippingLastName")}
                          placeholder="Prezime"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="shippingStreet">Ulica i broj</Label>
                        <Input
                          id="shippingStreet"
                          {...register("shippingStreet")}
                          placeholder="Ulica i kućni broj"
                        />
                      </div>
                      <div>
                        <Label htmlFor="shippingCity">Grad</Label>
                        <Input
                          id="shippingCity"
                          {...register("shippingCity")}
                          placeholder="Grad"
                        />
                      </div>
                      <div>
                        <Label htmlFor="shippingPostalCode">
                          Poštanski broj
                        </Label>
                        <Input
                          id="shippingPostalCode"
                          {...register("shippingPostalCode")}
                          placeholder="71000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="shippingCountry">Država</Label>
                        <Input
                          id="shippingCountry"
                          {...register("shippingCountry")}
                          placeholder="Bosna i Hercegovina"
                        />
                      </div>
                      <div>
                        <Label htmlFor="shippingPhone">Broj telefona</Label>
                        <Input
                          id="shippingPhone"
                          {...register("shippingPhone")}
                          placeholder="+387 61 234 567"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 1 Navigation */}
                <div className="flex justify-end mt-6">
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="font-oswald uppercase bg-brand-orange hover:bg-brand-orange/90 px-8"
                  >
                    Nastavi na plaćanje
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>

              {/* STEP 2: Payment */}
              <div
                className={cn(
                  "transition-all duration-500",
                  currentStep === 2 ? "opacity-100 translate-x-0" : "hidden",
                )}
              >
                {/* Payment Method */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="font-oswald text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-brand-orange" />
                    Način plaćanja
                  </h2>
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cash")}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-xl border-2 transition-all w-full",
                        paymentMethod === "cash"
                          ? "border-brand-orange bg-brand-orange/5"
                          : "border-gray-200 hover:border-gray-300",
                      )}
                    >
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                          paymentMethod === "cash"
                            ? "border-brand-orange"
                            : "border-gray-300",
                        )}
                      >
                        {paymentMethod === "cash" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-brand-orange" />
                        )}
                      </div>
                      <Truck className="w-5 h-5 text-gray-600" />
                      <div className="text-left flex-1">
                        <p className="font-oswald font-bold text-gray-900">
                          Plaćanje pouzećem
                        </p>
                        <p className="text-xs text-gray-500">
                          Platite prilikom preuzimanja
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      disabled
                      className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 w-full opacity-60 cursor-not-allowed"
                    >
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                      <CreditCard className="w-5 h-5 text-gray-400" />
                      <div className="text-left flex-1">
                        <p className="font-oswald font-bold text-gray-400">
                          Plaćanje karticom
                        </p>
                        <p className="text-xs text-gray-400">Uskoro dostupno</p>
                      </div>
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full font-oswald uppercase">
                        Uskoro
                      </span>
                    </button>
                  </div>

                  {/* Accepted Payment Methods */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-3">Prihvaćene kartice:</p>
                    <div className="flex flex-wrap gap-2">
                      <a href="https://www.visa.com" target="_blank" rel="noopener noreferrer" className="bg-gray-50 rounded p-1.5 hover:shadow transition-shadow">
                        <Image src="/shopkit_payments/visa.svg" alt="Visa" width={40} height={24} className="h-5 w-auto object-contain" />
                      </a>
                      <a href="https://www.mastercard.com" target="_blank" rel="noopener noreferrer" className="bg-gray-50 rounded p-1.5 hover:shadow transition-shadow">
                        <Image src="/shopkit_payments/mastercard.svg" alt="Mastercard" width={40} height={24} className="h-5 w-auto object-contain" />
                      </a>
                      <a href="https://www.mastercard.com" target="_blank" rel="noopener noreferrer" className="bg-gray-50 rounded p-1.5 hover:shadow transition-shadow">
                        <Image src="/shopkit_payments/maestro.svg" alt="Maestro" width={40} height={24} className="h-5 w-auto object-contain" />
                      </a>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <a href="https://monri.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                        <Image src="/shopkit_payments/pay-web-monri.svg" alt="Monri" width={60} height={20} className="h-4 w-auto object-contain" />
                      </a>
                      <span className="text-xs text-gray-400">Sigurno procesiranje plaćanja</span>
                    </div>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="bg-white rounded-2xl p-6 shadow-sm mt-6">
                  <h3 className="font-oswald text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-brand-orange" />
                    Promo kod
                  </h3>
                  {appliedPromo ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-mono font-bold text-green-700 text-lg">
                          {appliedPromo.code}
                        </span>
                        <span className="text-sm text-green-600">
                          {appliedPromo.type === "percentage" &&
                            `-${appliedPromo.value}%`}
                          {appliedPromo.type === "fixed" &&
                            `-${appliedPromo.value} KM`}
                          {appliedPromo.type === "free_shipping" &&
                            "Besplatna dostava"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={removePromoCode}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <Input
                        value={promoCode}
                        onChange={(e) =>
                          setPromoCode(e.target.value.toUpperCase())
                        }
                        placeholder="Unesite promo kod"
                        className="flex-1 uppercase font-mono text-lg"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleApplyPromo}
                        disabled={promoLoading || !promoCode.trim()}
                        className="px-6"
                      >
                        {promoLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Primijeni"
                        )}
                      </Button>
                    </div>
                  )}
                  {promoError && (
                    <p className="text-red-500 text-sm mt-2">{promoError}</p>
                  )}
                </div>

                {/* Order Notes */}
                <div className="bg-white rounded-2xl p-6 shadow-sm mt-6">
                  <h2 className="font-oswald text-lg font-bold text-gray-900 mb-4">
                    Napomena (opcionalno)
                  </h2>
                  <textarea
                    {...register("notes")}
                    rows={3}
                    placeholder="Posebne napomene za dostavu..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange resize-none"
                  />
                </div>

                {/* Step 2 Navigation */}
                <div className="flex justify-between mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="font-oswald uppercase px-8"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Nazad
                  </Button>
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="font-oswald uppercase bg-brand-orange hover:bg-brand-orange/90 px-8"
                  >
                    Pregledaj narudžbu
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>

              {/* STEP 3: Review */}
              <div
                className={cn(
                  "transition-all duration-500",
                  currentStep === 3 ? "opacity-100 translate-x-0" : "hidden",
                )}
              >
                {/* Customer Info Review */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-oswald text-lg font-bold text-gray-900 flex items-center gap-2">
                      <User className="w-5 h-5 text-brand-orange" />
                      Kupac
                    </h2>
                    <button
                      type="button"
                      onClick={() => goToStep(1)}
                      className="text-brand-orange hover:text-brand-orange/80 flex items-center gap-1 text-sm font-medium"
                    >
                      <Edit2 className="w-4 h-4" />
                      Uredi
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="font-medium text-gray-900">
                      {formValues.firstName} {formValues.lastName}
                    </p>
                    {(checkoutMode === "guest" || !isAuthenticated) &&
                      formValues.guestEmail && (
                        <p className="text-gray-600 text-sm">
                          {formValues.guestEmail}
                        </p>
                      )}
                    {isAuthenticated && user?.email && (
                      <p className="text-gray-600 text-sm">{user.email}</p>
                    )}
                    <p className="text-gray-600 text-sm">{formValues.phone}</p>
                  </div>
                </div>

                {/* Shipping Address Review */}
                <div className="bg-white rounded-2xl p-6 shadow-sm mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-oswald text-lg font-bold text-gray-900 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-brand-orange" />
                      Adresa dostave
                    </h2>
                    <button
                      type="button"
                      onClick={() => goToStep(1)}
                      className="text-brand-orange hover:text-brand-orange/80 flex items-center gap-1 text-sm font-medium"
                    >
                      <Edit2 className="w-4 h-4" />
                      Uredi
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    {(() => {
                      const addr = getShippingAddress();
                      return (
                        <>
                          <p className="font-medium text-gray-900">
                            {addr.firstName} {addr.lastName}
                          </p>
                          <p className="text-gray-600 text-sm">{addr.street}</p>
                          <p className="text-gray-600 text-sm">
                            {addr.postalCode} {addr.city}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {addr.country}
                          </p>
                          <p className="text-gray-600 text-sm mt-2">
                            {addr.phone}
                          </p>
                        </>
                      );
                    })()}
                  </div>
                  <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Očekivana dostava: 2-5 radnih dana</span>
                  </div>
                </div>

                {/* Payment Method Review */}
                <div className="bg-white rounded-2xl p-6 shadow-sm mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-oswald text-lg font-bold text-gray-900 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-brand-orange" />
                      Način plaćanja
                    </h2>
                    <button
                      type="button"
                      onClick={() => goToStep(2)}
                      className="text-brand-orange hover:text-brand-orange/80 flex items-center gap-1 text-sm font-medium"
                    >
                      <Edit2 className="w-4 h-4" />
                      Uredi
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                    <Truck className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {paymentMethod === "cash"
                          ? "Plaćanje pouzećem"
                          : "Plaćanje karticom"}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {paymentMethod === "cash"
                          ? "Platite prilikom preuzimanja pošiljke"
                          : "Sigurno online plaćanje"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items Review */}
                <div className="bg-white rounded-2xl p-6 shadow-sm mt-6">
                  <h2 className="font-oswald text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-brand-orange" />
                    Proizvodi ({items.length})
                  </h2>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={`${item.productId}-${item.variantId || "default"}`}
                        className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                          <Image
                            src={item.image || "/productimage.png"}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="object-contain w-full h-full p-2"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-oswald font-bold text-gray-900 truncate">
                            {item.name}
                          </p>
                          {item.variantName && (
                            <p className="text-sm text-gray-500">
                              {item.variantName}
                            </p>
                          )}
                          <p className="text-sm text-gray-600 mt-1">
                            {item.quantity} x {item.price.toFixed(2)} KM
                          </p>
                        </div>
                        <p className="font-oswald font-bold text-gray-900 text-lg">
                          {(item.price * item.quantity).toFixed(2)} KM
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Notes Review */}
                {formValues.notes && (
                  <div className="bg-white rounded-2xl p-6 shadow-sm mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-oswald text-lg font-bold text-gray-900">
                        Napomena
                      </h2>
                      <button
                        type="button"
                        onClick={() => goToStep(2)}
                        className="text-brand-orange hover:text-brand-orange/80 flex items-center gap-1 text-sm font-medium"
                      >
                        <Edit2 className="w-4 h-4" />
                        Uredi
                      </button>
                    </div>
                    <p className="text-gray-600 bg-gray-50 rounded-xl p-4">
                      {formValues.notes}
                    </p>
                  </div>
                )}

                {/* Terms & Submit */}
                <div className="bg-white rounded-2xl p-6 shadow-sm mt-6">
                  {/* Terms Checkbox */}
                  <div className="flex items-start space-x-3 mb-6">
                    <Checkbox
                      id="terms"
                      checked={acceptedTerms}
                      onCheckedChange={(checked) =>
                        setAcceptedTerms(checked === true)
                      }
                      className="mt-0.5"
                    />
                    <Label
                      htmlFor="terms"
                      className="text-sm font-normal cursor-pointer leading-relaxed"
                    >
                      Pročitao/la sam i prihvatam{" "}
                      <Link
                        href="/terms"
                        className="text-brand-orange hover:underline"
                        target="_blank"
                      >
                        uvjete korištenja
                      </Link>{" "}
                      i{" "}
                      <Link
                        href="/privacy"
                        className="text-brand-orange hover:underline"
                        target="_blank"
                      >
                        politiku privatnosti
                      </Link>
                      .
                    </Label>
                  </div>

                  {/* Trust Badges */}
                  <div className="flex items-center justify-center gap-6 py-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span>Sigurna kupovina</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Truck className="w-5 h-5 text-brand-orange" />
                      <span>Brza dostava</span>
                    </div>
                  </div>
                </div>

                {/* Step 3 Navigation */}
                <div className="flex justify-between mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="font-oswald uppercase px-8"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Nazad
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !acceptedTerms}
                    className="font-oswald uppercase bg-brand-orange hover:bg-brand-orange/90 px-12 py-6 text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Obrada...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Potvrdi narudžbu
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary (Always Visible) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <h2 className="font-oswald text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-brand-orange" />
                  Pregled narudžbe
                </h2>

                {/* Cart Items */}
                <div className="space-y-3 mb-6 max-h-[200px] overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.variantId || "default"}`}
                      className="flex gap-3"
                    >
                      <div className="w-14 h-14 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image || "/productimage.png"}
                          alt={item.name}
                          width={56}
                          height={56}
                          className="object-contain w-full h-full p-1"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-oswald font-medium text-gray-900 text-sm truncate">
                          {item.name}
                        </p>
                        {item.variantName && (
                          <p className="text-xs text-gray-500">
                            {item.variantName}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          Količina: {item.quantity}
                        </p>
                      </div>
                      <p className="font-oswald font-bold text-gray-900 text-sm">
                        {(item.price * item.quantity).toFixed(2)} KM
                      </p>
                    </div>
                  ))}
                </div>

                {/* Applied Promo (if any) */}
                {appliedPromo && (
                  <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-4">
                    <Tag className="w-4 h-4 text-green-600" />
                    <span className="font-mono font-bold text-green-700 text-sm">
                      {appliedPromo.code}
                    </span>
                  </div>
                )}

                {/* Totals */}
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Međuzbir:</span>
                    <span className="font-oswald font-medium">
                      {subtotal.toFixed(2)} KM
                    </span>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Popust:</span>
                      <span className="font-oswald font-medium">
                        -{promoDiscount.toFixed(2)} KM
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Dostava:</span>
                    <span className="font-oswald font-medium">
                      {finalShipping === 0 ? (
                        <span className="text-green-600">Besplatna</span>
                      ) : (
                        `${finalShipping.toFixed(2)} KM`
                      )}
                    </span>
                  </div>
                  {baseShipping > 0 && finalShipping === 0 && !appliedPromo && (
                    <p className="text-xs text-green-600">
                      Besplatna dostava za narudžbe preko{" "}
                      {shippingSettings.freeShippingThreshold} KM
                    </p>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      PDV ({(shippingSettings.taxRate * 100).toFixed(0)}%):
                    </span>
                    <span className="font-oswald font-medium">
                      {tax.toFixed(2)} KM
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gray-200">
                    <span className="font-oswald font-bold text-lg">
                      Ukupno:
                    </span>
                    <span className="font-oswald font-bold text-xl text-brand-orange">
                      {total.toFixed(2)} KM
                    </span>
                  </div>
                </div>

                {/* Current Step Indicator for Mobile */}
                <div className="mt-6 pt-4 border-t border-gray-100 lg:hidden">
                  <p className="text-center text-sm text-gray-500">
                    Korak {currentStep} od 3
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
