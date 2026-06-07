"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/AuthContext";
import {
  useUpdateProfile,
  useChangePassword,
  useSetPassword,
  useHasPassword,
  useRequestEmailChange,
  usePendingEmailChange,
  useCancelEmailChange,
} from "@/hooks/useAccountApi";
import { AdminHeader } from "@/components/admin";
import { SidebarLayout, SidebarTab } from "@/components/admin/SidebarLayout";
import { ContentCard } from "@/components/admin/ContentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Mail,
  Phone,
  Lock,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  X,
  Clock,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { bs } from "date-fns/locale";

const profileSchema = z.object({
  firstName: z.string().min(1, "Ime je obavezno"),
  lastName: z.string().min(1, "Prezime je obavezno"),
  phone: z.string().optional(),
});

const addressSchema = z.object({
  street: z.string().min(1, "Adresa je obavezna"),
  city: z.string().min(1, "Grad je obavezan"),
  postalCode: z.string().min(1, "Poštanski broj je obavezan"),
  country: z.string().min(1, "Država je obavezna"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Trenutna lozinka je obavezna"),
    newPassword: z.string().min(6, "Nova lozinka mora imati najmanje 6 karaktera"),
    confirmPassword: z.string().min(1, "Potvrdite novu lozinku"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Lozinke se ne podudaraju",
    path: ["confirmPassword"],
  });

const setPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Lozinka mora imati najmanje 6 karaktera"),
    confirmPassword: z.string().min(1, "Potvrdite lozinku"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Lozinke se ne podudaraju",
    path: ["confirmPassword"],
  });

const emailChangeSchema = z.object({
  newEmail: z.string().email("Nevažeća email adresa"),
  password: z.string().min(1, "Lozinka je obavezna za potvrdu"),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type AddressFormData = z.infer<typeof addressSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;
type SetPasswordFormData = z.infer<typeof setPasswordSchema>;
type EmailChangeFormData = z.infer<typeof emailChangeSchema>;

const sidebarTabs: SidebarTab[] = [
  { id: "profile", label: "Osobni podaci", icon: User },
  { id: "address", label: "Adresa dostave", icon: MapPin },
  { id: "email", label: "Email adresa", icon: Mail },
  { id: "password", label: "Lozinka", icon: Lock },
  { id: "account-type", label: "Tip računa", icon: ShieldCheck },
];

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const setPasswordMutation = useSetPassword();
  const requestEmailChangeMutation = useRequestEmailChange();
  const cancelEmailChangeMutation = useCancelEmailChange();
  const { data: hasPasswordData, isLoading: isLoadingHasPassword } = useHasPassword();
  const { data: pendingEmailData, isLoading: isLoadingPending } = usePendingEmailChange();

  const [profileSuccess, setProfileSuccess] = useState(false);
  const [addressSuccess, setAddressSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [newPasswordSuccess, setNewPasswordSuccess] = useState(false);
  const [emailChangeSuccess, setEmailChangeSuccess] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSetNewPassword, setShowSetNewPassword] = useState(false);
  const [showSetConfirmPassword, setShowSetConfirmPassword] = useState(false);
  const [showEmailPassword, setShowEmailPassword] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
    },
  });

  const {
    register: registerAddress,
    handleSubmit: handleAddressSubmit,
    formState: { errors: addressErrors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: (user as unknown as { address?: { street?: string } })?.address?.street || "",
      city: (user as unknown as { address?: { city?: string } })?.address?.city || "",
      postalCode: (user as unknown as { address?: { postalCode?: string } })?.address?.postalCode || "",
      country: (user as unknown as { address?: { country?: string } })?.address?.country || "Bosna i Hercegovina",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const {
    register: registerSetPassword,
    handleSubmit: handleSetPasswordSubmit,
    formState: { errors: setPasswordErrors },
    reset: resetSetPassword,
  } = useForm<SetPasswordFormData>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const {
    register: registerEmailChange,
    handleSubmit: handleEmailChangeSubmit,
    formState: { errors: emailChangeErrors },
    reset: resetEmailChange,
  } = useForm<EmailChangeFormData>({
    resolver: zodResolver(emailChangeSchema),
    defaultValues: {
      newEmail: "",
      password: "",
    },
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      setProfileSuccess(false);
      await updateProfileMutation.mutateAsync(data);
      setProfileSuccess(true);
      if (refreshUser) {
        await refreshUser();
      }
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch {
      // Error handled by mutation
    }
  };

  const onAddressSubmit = async (data: AddressFormData) => {
    try {
      setAddressSuccess(false);
      await updateProfileMutation.mutateAsync({ address: data });
      setAddressSuccess(true);
      if (refreshUser) {
        await refreshUser();
      }
      setTimeout(() => setAddressSuccess(false), 3000);
    } catch {
      // Error handled by mutation
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      setPasswordSuccess(false);
      await changePasswordMutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setPasswordSuccess(true);
      resetPassword();
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch {
      // Error handled by mutation
    }
  };

  const onSetPasswordSubmit = async (data: SetPasswordFormData) => {
    try {
      setNewPasswordSuccess(false);
      await setPasswordMutation.mutateAsync({
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      setNewPasswordSuccess(true);
      resetSetPassword();
      setTimeout(() => setNewPasswordSuccess(false), 3000);
    } catch {
      // Error handled by mutation
    }
  };

  const onEmailChangeSubmit = async (data: EmailChangeFormData) => {
    try {
      setEmailChangeSuccess(false);
      await requestEmailChangeMutation.mutateAsync(data);
      setEmailChangeSuccess(true);
      resetEmailChange();
      setTimeout(() => setEmailChangeSuccess(false), 5000);
    } catch {
      // Error handled by mutation
    }
  };

  const handleCancelEmailChange = async () => {
    try {
      await cancelEmailChangeMutation.mutateAsync();
    } catch {
      // Error handled by mutation
    }
  };

  const isGoogleUser = user?.provider === "google";
  const hasPassword = hasPasswordData?.data?.hasPassword ?? false;
  const pendingEmail = pendingEmailData?.data;

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Postavke računa"
        description="Upravljajte svojim profilom i sigurnosnim postavkama"
      />

      <div className="flex-1 p-6">
        <SidebarLayout tabs={sidebarTabs}>
          <div className="space-y-6">
            {/* Profile Information */}
            <ContentCard id="profile" title="Osobni podaci" icon={User}>
              <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Ime</Label>
                    <Input
                      id="firstName"
                      {...registerProfile("firstName")}
                      className={cn(profileErrors.firstName && "border-red-500")}
                    />
                    {profileErrors.firstName && (
                      <p className="text-sm text-red-500">
                        {profileErrors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Prezime</Label>
                    <Input
                      id="lastName"
                      {...registerProfile("lastName")}
                      className={cn(profileErrors.lastName && "border-red-500")}
                    />
                    {profileErrors.lastName && (
                      <p className="text-sm text-red-500">
                        {profileErrors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Telefon
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+387 61 234 567"
                    {...registerProfile("phone")}
                  />
                </div>

                {updateProfileMutation.error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    <p className="text-sm">{(updateProfileMutation.error as Error).message}</p>
                  </div>
                )}

                {profileSuccess && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 text-green-600 rounded-lg">
                    <CheckCircle className="w-4 h-4" />
                    <p className="text-sm">Profil uspješno ažuriran</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Spremi promjene
                </Button>
              </form>
            </ContentCard>

            {/* Shipping Address */}
            <ContentCard id="address" title="Adresa dostave" icon={MapPin}>
              <form onSubmit={handleAddressSubmit(onAddressSubmit)} className="space-y-4">
                <p className="text-sm text-gray-500 mb-4">
                  Ova adresa će biti korištena kao zadana adresa dostave prilikom naručivanja.
                </p>

                <div className="space-y-2">
                  <Label htmlFor="street">Ulica i broj</Label>
                  <Input
                    id="street"
                    placeholder="npr. Ulica Maršala Tita 10"
                    {...registerAddress("street")}
                    className={cn(addressErrors.street && "border-red-500")}
                  />
                  {addressErrors.street && (
                    <p className="text-sm text-red-500">{addressErrors.street.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Grad</Label>
                    <Input
                      id="city"
                      placeholder="npr. Sarajevo"
                      {...registerAddress("city")}
                      className={cn(addressErrors.city && "border-red-500")}
                    />
                    {addressErrors.city && (
                      <p className="text-sm text-red-500">{addressErrors.city.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Poštanski broj</Label>
                    <Input
                      id="postalCode"
                      placeholder="npr. 71000"
                      {...registerAddress("postalCode")}
                      className={cn(addressErrors.postalCode && "border-red-500")}
                    />
                    {addressErrors.postalCode && (
                      <p className="text-sm text-red-500">{addressErrors.postalCode.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Država</Label>
                  <Input
                    id="country"
                    placeholder="npr. Bosna i Hercegovina"
                    {...registerAddress("country")}
                    className={cn(addressErrors.country && "border-red-500")}
                  />
                  {addressErrors.country && (
                    <p className="text-sm text-red-500">{addressErrors.country.message}</p>
                  )}
                </div>

                {addressSuccess && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 text-green-600 rounded-lg">
                    <CheckCircle className="w-4 h-4" />
                    <p className="text-sm">Adresa uspješno sačuvana</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Sačuvaj adresu
                </Button>
              </form>
            </ContentCard>

            {/* Email Address */}
            <ContentCard id="email" title="Email adresa" icon={Mail}>
              <div className="space-y-4">
                {/* Current Email */}
                <div className="space-y-2">
                  <Label>Trenutna email adresa</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="bg-gray-50"
                    />
                    {user?.isVerified && (
                      <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 whitespace-nowrap">
                        <CheckCircle className="w-3 h-3" />
                        Verificirano
                      </span>
                    )}
                  </div>
                </div>

                {/* Pending Email Change */}
                {!isLoadingPending && pendingEmail?.pending && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-amber-800">
                            Zahtjev za promjenu na čekanju
                          </p>
                          <p className="text-sm text-amber-700 mt-1">
                            Nova adresa: <strong>{pendingEmail.newEmail}</strong>
                          </p>
                          <p className="text-xs text-amber-600 mt-1">
                            Provjerite inbox nove email adrese za verifikacijski link.
                            {pendingEmail.expiresAt && (
                              <>
                                {" "}
                                Ističe{" "}
                                {formatDistanceToNow(new Date(pendingEmail.expiresAt), {
                                  addSuffix: true,
                                  locale: bs,
                                })}
                                .
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelEmailChange}
                        disabled={cancelEmailChangeMutation.isPending}
                        className="text-amber-700 hover:text-amber-900 hover:bg-amber-100"
                      >
                        {cancelEmailChangeMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Change Email Form */}
                {hasPassword && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Promijeni email adresu</h4>
                    <form onSubmit={handleEmailChangeSubmit(onEmailChangeSubmit)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="newEmail">Nova email adresa</Label>
                        <Input
                          id="newEmail"
                          type="email"
                          placeholder="nova@email.com"
                          {...registerEmailChange("newEmail")}
                          className={cn(emailChangeErrors.newEmail && "border-red-500")}
                        />
                        {emailChangeErrors.newEmail && (
                          <p className="text-sm text-red-500">
                            {emailChangeErrors.newEmail.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="emailPassword">Lozinka (za potvrdu)</Label>
                        <div className="relative">
                          <Input
                            id="emailPassword"
                            type={showEmailPassword ? "text" : "password"}
                            placeholder="Unesite vašu lozinku"
                            {...registerEmailChange("password")}
                            className={cn(
                              "pr-10",
                              emailChangeErrors.password && "border-red-500"
                            )}
                          />
                          <button
                            type="button"
                            onClick={() => setShowEmailPassword(!showEmailPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showEmailPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        {emailChangeErrors.password && (
                          <p className="text-sm text-red-500">
                            {emailChangeErrors.password.message}
                          </p>
                        )}
                      </div>

                      {requestEmailChangeMutation.error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg">
                          <AlertCircle className="w-4 h-4" />
                          <p className="text-sm">
                            {(requestEmailChangeMutation.error as Error).message}
                          </p>
                        </div>
                      )}

                      {emailChangeSuccess && (
                        <div className="flex items-center gap-2 p-3 bg-green-50 text-green-600 rounded-lg">
                          <CheckCircle className="w-4 h-4" />
                          <p className="text-sm">
                            Verifikacijski email poslan na novu adresu. Provjerite inbox.
                          </p>
                        </div>
                      )}

                      <Button
                        type="submit"
                        variant="outline"
                        disabled={requestEmailChangeMutation.isPending}
                      >
                        {requestEmailChangeMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Mail className="w-4 h-4 mr-2" />
                        )}
                        Zatraži promjenu
                      </Button>
                    </form>
                  </div>
                )}

                {!hasPassword && !isLoadingHasPassword && (
                  <p className="text-sm text-muted-foreground">
                    Morate prvo postaviti lozinku da biste mogli promijeniti email adresu.
                  </p>
                )}
              </div>
            </ContentCard>

            {/* Password Section */}
            <ContentCard id="password" title="Lozinka" icon={Lock}>
              {isLoadingHasPassword ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                </div>
              ) : (
                <>
                  {/* Set Password (for Google users without password) */}
                  {isGoogleUser && !hasPassword && (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Napomena:</strong> Prijavljeni ste putem Google-a. Postavite lozinku
                          kako biste se mogli prijaviti i putem emaila.
                        </p>
                      </div>

                      <form onSubmit={handleSetPasswordSubmit(onSetPasswordSubmit)} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="setNewPassword">Nova lozinka</Label>
                          <div className="relative">
                            <Input
                              id="setNewPassword"
                              type={showSetNewPassword ? "text" : "password"}
                              {...registerSetPassword("newPassword")}
                              className={cn(
                                "pr-10",
                                setPasswordErrors.newPassword && "border-red-500"
                              )}
                            />
                            <button
                              type="button"
                              onClick={() => setShowSetNewPassword(!showSetNewPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showSetNewPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                          {setPasswordErrors.newPassword && (
                            <p className="text-sm text-red-500">
                              {setPasswordErrors.newPassword.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="setConfirmPassword">Potvrdite lozinku</Label>
                          <div className="relative">
                            <Input
                              id="setConfirmPassword"
                              type={showSetConfirmPassword ? "text" : "password"}
                              {...registerSetPassword("confirmPassword")}
                              className={cn(
                                "pr-10",
                                setPasswordErrors.confirmPassword && "border-red-500"
                              )}
                            />
                            <button
                              type="button"
                              onClick={() => setShowSetConfirmPassword(!showSetConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showSetConfirmPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                          {setPasswordErrors.confirmPassword && (
                            <p className="text-sm text-red-500">
                              {setPasswordErrors.confirmPassword.message}
                            </p>
                          )}
                        </div>

                        {setPasswordMutation.error && (
                          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg">
                            <AlertCircle className="w-4 h-4" />
                            <p className="text-sm">{(setPasswordMutation.error as Error).message}</p>
                          </div>
                        )}

                        {newPasswordSuccess && (
                          <div className="flex items-center gap-2 p-3 bg-green-50 text-green-600 rounded-lg">
                            <CheckCircle className="w-4 h-4" />
                            <p className="text-sm">
                              Lozinka uspješno postavljena! Sada se možete prijaviti i putem emaila.
                            </p>
                          </div>
                        )}

                        <Button
                          type="submit"
                          className="bg-blue-500 hover:bg-blue-600"
                          disabled={setPasswordMutation.isPending}
                        >
                          {setPasswordMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <KeyRound className="w-4 h-4 mr-2" />
                          )}
                          Postavi lozinku
                        </Button>
                      </form>
                    </div>
                  )}

                  {/* Change Password (for users with password) */}
                  {hasPassword && (
                    <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Trenutna lozinka</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            {...registerPassword("currentPassword")}
                            className={cn(
                              "pr-10",
                              passwordErrors.currentPassword && "border-red-500"
                            )}
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        {passwordErrors.currentPassword && (
                          <p className="text-sm text-red-500">
                            {passwordErrors.currentPassword.message}
                          </p>
                        )}
                      </div>

                      <div className="border-t border-gray-200 pt-4" />

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Nova lozinka</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            {...registerPassword("newPassword")}
                            className={cn(
                              "pr-10",
                              passwordErrors.newPassword && "border-red-500"
                            )}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showNewPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        {passwordErrors.newPassword && (
                          <p className="text-sm text-red-500">
                            {passwordErrors.newPassword.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Potvrdite novu lozinku</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            {...registerPassword("confirmPassword")}
                            className={cn(
                              "pr-10",
                              passwordErrors.confirmPassword && "border-red-500"
                            )}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        {passwordErrors.confirmPassword && (
                          <p className="text-sm text-red-500">
                            {passwordErrors.confirmPassword.message}
                          </p>
                        )}
                      </div>

                      {changePasswordMutation.error && (
                        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg">
                          <AlertCircle className="w-4 h-4" />
                          <p className="text-sm">{(changePasswordMutation.error as Error).message}</p>
                        </div>
                      )}

                      {passwordSuccess && (
                        <div className="flex items-center gap-2 p-3 bg-green-50 text-green-600 rounded-lg">
                          <CheckCircle className="w-4 h-4" />
                          <p className="text-sm">Lozinka uspješno promijenjena</p>
                        </div>
                      )}

                      <Button
                        type="submit"
                        variant="outline"
                        disabled={changePasswordMutation.isPending}
                      >
                        {changePasswordMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Lock className="w-4 h-4 mr-2" />
                        )}
                        Promijeni lozinku
                      </Button>
                    </form>
                  )}
                </>
              )}
            </ContentCard>

            {/* Account Type */}
            <ContentCard id="account-type" title="Tip računa" icon={ShieldCheck}>
              <div className="flex items-center gap-4">
                {isGoogleUser ? (
                  <>
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Google račun</p>
                      <p className="text-sm text-gray-500">
                        Prijavljeni ste putem Google-a
                        {hasPassword && " (lozinka je također postavljena)"}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <Mail className="w-6 h-6 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Email račun</p>
                      <p className="text-sm text-gray-500">
                        Prijavljeni ste putem emaila i lozinke
                      </p>
                    </div>
                  </>
                )}
              </div>
            </ContentCard>
          </div>
        </SidebarLayout>
      </div>
    </div>
  );
}
