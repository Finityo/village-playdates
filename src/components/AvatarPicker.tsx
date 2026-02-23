import { useState, useRef } from "react";
import { Camera, Loader2, X, Upload, ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import avatarCat from "@/assets/avatars/avatar-cat.png";
import avatarFox from "@/assets/avatars/avatar-fox.png";
import avatarBunny from "@/assets/avatars/avatar-bunny.png";
import avatarOwl from "@/assets/avatars/avatar-owl.png";
import avatarBear from "@/assets/avatars/avatar-bear.png";
import avatarPanda from "@/assets/avatars/avatar-panda.png";

const PRESET_AVATARS = [
  { id: "cat", src: avatarCat, label: "Cat" },
  { id: "fox", src: avatarFox, label: "Fox" },
  { id: "bunny", src: avatarBunny, label: "Bunny" },
  { id: "owl", src: avatarOwl, label: "Owl" },
  { id: "bear", src: avatarBear, label: "Bear" },
  { id: "panda", src: avatarPanda, label: "Panda" },
];

interface AvatarPickerProps {
  userId: string;
  currentAvatarUrl: string | null;
  displayName: string;
  avatarColor: string;
  onAvatarChanged: (url: string) => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export default function AvatarPicker({
  userId,
  currentAvatarUrl,
  displayName,
  avatarColor,
  onAvatarChanged,
}: AvatarPickerProps) {
  const { toast } = useToast();
  const [showPicker, setShowPicker] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savingPreset, setSavingPreset] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const initials = getInitials(displayName);
  const isPreset = currentAvatarUrl?.startsWith("preset:");
  const presetEmoji = isPreset ? currentAvatarUrl!.replace("preset:", "") : null;

  // Check if current avatar matches a preset image
  const isPresetImage = currentAvatarUrl && PRESET_AVATARS.some(a => currentAvatarUrl.includes(`avatar-${a.id}`));

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast({ title: "Unsupported format", description: "Please use JPG, PNG, or WebP.", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 5 MB.", variant: "destructive" });
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${userId}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });

    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const url = `${data.publicUrl}?t=${Date.now()}`;

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ avatar_url: url })
      .eq("id", userId);

    if (profileError) {
      toast({ title: "Couldn't save avatar", description: profileError.message, variant: "destructive" });
    } else {
      onAvatarChanged(url);
      toast({ title: "Photo updated! 📸" });
      setShowPicker(false);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handlePresetSelect = async (avatar: typeof PRESET_AVATARS[0]) => {
    setSavingPreset(avatar.id);

    // Store the imported asset path as the avatar URL
    const { error } = await supabase
      .from("profiles")
      .update({ avatar_url: `preset-avatar:${avatar.id}` })
      .eq("id", userId);

    if (error) {
      toast({ title: "Couldn't save avatar", description: error.message, variant: "destructive" });
    } else {
      onAvatarChanged(`preset-avatar:${avatar.id}`);
      toast({ title: `${avatar.label} avatar selected! 🎉` });
      setShowPicker(false);
    }
    setSavingPreset(null);
  };

  // Render current avatar
  const renderAvatar = () => {
    const presetMatch = currentAvatarUrl?.startsWith("preset-avatar:")
      ? PRESET_AVATARS.find(a => a.id === currentAvatarUrl.replace("preset-avatar:", ""))
      : null;

    if (presetMatch) {
      return <img src={presetMatch.src} alt={presetMatch.label} className="w-full h-full object-cover" />;
    }
    if (currentAvatarUrl && !currentAvatarUrl.startsWith("preset:")) {
      return <img src={currentAvatarUrl} alt={displayName} className="w-full h-full object-cover" />;
    }
    if (isPreset && presetEmoji) {
      return (
        <div className="w-full h-full flex items-center justify-center text-4xl">
          {presetEmoji}
        </div>
      );
    }
    return (
      <div className="w-full h-full flex items-center justify-center text-3xl font-black text-white">
        {initials}
      </div>
    );
  };

  return (
    <div className="relative inline-block">
      {/* Avatar circle */}
      <div
        className="w-24 h-24 rounded-full overflow-hidden border-4 border-background shadow-soft flex-shrink-0 cursor-pointer"
        onClick={() => setShowPicker(true)}
        style={{
          backgroundColor:
            currentAvatarUrl && !currentAvatarUrl.startsWith("preset:") && !currentAvatarUrl.startsWith("preset-avatar:")
              ? undefined
              : currentAvatarUrl?.startsWith("preset-avatar:")
              ? "hsl(var(--card))"
              : avatarColor,
        }}
      >
        {renderAvatar()}
      </div>

      {/* Camera button overlay */}
      <button
        onClick={() => setShowPicker(true)}
        className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center border-2 border-background shadow-soft transition-all active:scale-90"
        aria-label="Change profile photo"
      >
        <Camera className="h-3.5 w-3.5 text-white" />
      </button>

      {/* Picker modal */}
      {showPicker && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50"
          onClick={() => setShowPicker(false)}
        >
          <div
            className="bg-background rounded-t-3xl w-full max-w-md p-5 pb-8 safe-area-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full bg-border mx-auto mb-4" />
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-black text-lg">Choose Your Avatar</h3>
              <button onClick={() => setShowPicker(false)} className="p-2 rounded-xl active:bg-muted transition-colors">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* Preset avatars */}
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              <ImageIcon className="h-3 w-3 inline mr-1" />
              Pick an avatar
            </p>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {PRESET_AVATARS.map((avatar) => {
                const isSelected = currentAvatarUrl === `preset-avatar:${avatar.id}`;
                return (
                  <button
                    key={avatar.id}
                    onClick={() => handlePresetSelect(avatar)}
                    disabled={savingPreset !== null}
                    className={`relative flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all active:scale-[0.96] ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    {savingPreset === avatar.id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-2xl">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      </div>
                    )}
                    <img src={avatar.src} alt={avatar.label} className="w-14 h-14 rounded-full object-cover" />
                    <span className="text-[11px] font-bold text-muted-foreground">{avatar.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Upload option */}
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              <Upload className="h-3 w-3 inline mr-1" />
              Or upload your own
            </p>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="w-full py-4 rounded-2xl border-2 border-dashed border-border bg-card text-sm font-bold text-muted-foreground active:bg-muted transition-all flex items-center justify-center gap-2"
            >
              {uploading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</>
              ) : (
                <><Camera className="h-4 w-4" /> Upload a Photo</>
              )}
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>
      )}
    </div>
  );
}
