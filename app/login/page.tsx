"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const signInDemo = (role: "admin" | "data_entry") => {
    setError(null);

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    document.cookie = `app_role=${role}; path=/; max-age=${60 * 60 * 8}; SameSite=Lax`;
    router.push(role === "admin" ? "/admin/dashboard" : "/entry/today");
    router.refresh();
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Beirut Side Sales Ledger</CardTitle>
          <CardDescription>Internal access only</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Button className="w-full" size="lg" onClick={() => signInDemo("data_entry")}>Sign in as Seller</Button>
            <Button className="w-full" size="lg" variant="outline" onClick={() => signInDemo("admin")}>Sign in as Admin</Button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>
    </main>
  );
}
