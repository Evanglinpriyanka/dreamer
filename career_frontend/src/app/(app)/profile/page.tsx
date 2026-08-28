"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Check, Mail, UserRound } from "lucide-react";
import { profileApi } from "@/services/api";
import type { UserProfile } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [education, setEducation] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    profileApi.get()
      .then((data) => {
        setProfile(data);
        setName(data.name || "");
        setEducation(data.education || "");
      })
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Unable to load your profile."))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");
    setError("");
    try {
      const updated = await profileApi.update({ name, education });
      setProfile(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      setMessage("Profile updated");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to save your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="mx-auto max-w-3xl py-16 text-center text-muted-foreground" role="status">Loading your profile...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-4">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Your profile</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Shape your career context.</h1>
        <p className="max-w-xl text-muted-foreground">Keep the details behind your recommendations current as your direction evolves.</p>
      </header>

      {error && <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive" role="alert"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}
      {message && <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm text-emerald-700" role="status"><Check className="h-4 w-4" />{message}</div>}

      <form onSubmit={handleSave} className="glass grid gap-8 rounded-3xl p-6 shadow-elegant md:p-8">
        <div className="flex items-center gap-4 border-b border-border/70 pb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><UserRound className="h-7 w-7" /></div>
          <div><p className="font-semibold">Personal information</p><p className="text-sm text-muted-foreground">Used to personalize your experience.</p></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="profile-name">Name</Label><Input id="profile-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" /></div>
          <div className="space-y-2"><Label htmlFor="profile-email">Email</Label><div className="relative"><Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input id="profile-email" value={profile?.email || ""} readOnly className="pl-9 bg-muted/40" /></div></div>
        </div>
        <div className="space-y-2"><Label htmlFor="profile-education">Education</Label><Input id="profile-education" value={education} onChange={(event) => setEducation(event.target.value)} placeholder="Your field of study or highest qualification" /></div>
        <div className="flex justify-end"><Button type="submit" variant="hero" disabled={isSaving}>{isSaving ? "Saving..." : "Save changes"}</Button></div>
      </form>
    </div>
  );
}
