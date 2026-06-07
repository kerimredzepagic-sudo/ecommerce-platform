"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth, useRequireAuth } from "@/contexts/AuthContext";

export default function UserSettingsPage() {
  const { user, logout } = useAuth();
  const { isLoading } = useRequireAuth();

  const handleLogout = async () => {
    await logout();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>User Settings</CardTitle>
          <CardDescription>Manage your account settings and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">User ID</h3>
            <p className="text-base">{user.id}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="text-base">{user.email}</p>
          </div>

          {user.fullName && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Name</h3>
              <p className="text-base">{user.fullName}</p>
            </div>
          )}

          {user.phone && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Phone</h3>
              <p className="text-base">{user.phone}</p>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Role</h3>
            <p className="text-base capitalize">{user.role}</p>
          </div>

          <div className="pt-4 border-t">
            <Button onClick={handleLogout} variant="destructive">
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Protected Route Example</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              This is a protected route. Only authenticated users can access this page. If you try
              to access this page without being logged in, you will be redirected to the login page.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
