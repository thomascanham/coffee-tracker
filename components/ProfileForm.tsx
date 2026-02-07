"use client";

import { useState } from "react";
import BrewMethodSelect from "./BrewMethodSelect";

interface ProfileData {
  username: string;
  email: string;
  profilePictureUrl: string;
  favouriteBrewMethods: string[];
}

export default function ProfileForm({ initialData }: { initialData: ProfileData }) {
  const [editing, setEditing] = useState(false);
  const [data, setData] = useState<ProfileData>(initialData);
  const [form, setForm] = useState<ProfileData>(initialData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setError("");
    setSaving(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          profilePictureUrl: form.profilePictureUrl,
          favouriteBrewMethods: form.favouriteBrewMethods,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Something went wrong");
        setSaving(false);
        return;
      }

      setData({
        username: result.username || "",
        email: data.email,
        profilePictureUrl: result.profilePictureUrl || "",
        favouriteBrewMethods: (result.favouriteBrewMethods as string[]) || [],
      });
      setEditing(false);
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setForm(data);
    setEditing(false);
    setError("");
  }

  return (
    <div className="rounded-2xl border border-cream-200 bg-white p-6 shadow-sm">
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Profile Picture */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-terracotta-600 text-xl font-bold text-cream-50">
          {(editing ? form.profilePictureUrl : data.profilePictureUrl) ? (
            <img
              src={editing ? form.profilePictureUrl : data.profilePictureUrl}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            (data.username || data.email).charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <p className="font-medium text-espresso-900">
            {data.username || "No username set"}
          </p>
          <p className="text-sm text-espresso-500">{data.email}</p>
        </div>
      </div>

      {editing ? (
        <div className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-espresso-700">
              Profile Picture URL
            </label>
            <input
              type="url"
              value={form.profilePictureUrl}
              onChange={(e) => setForm({ ...form, profilePictureUrl: e.target.value })}
              className="w-full rounded-lg border border-cream-300 px-4 py-2.5 text-sm text-espresso-900 outline-none transition-colors focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500"
              placeholder="https://example.com/photo.jpg"
            />
            {form.profilePictureUrl && (
              <div className="mt-2">
                <img
                  src={form.profilePictureUrl}
                  alt="Preview"
                  className="h-20 w-20 rounded-lg object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-espresso-700">
              Username
            </label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full rounded-lg border border-cream-300 px-4 py-2.5 text-sm text-espresso-900 outline-none transition-colors focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500"
              placeholder="Choose a username"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-espresso-700">
              Email
            </label>
            <input
              type="email"
              value={data.email}
              disabled
              className="w-full rounded-lg border border-cream-200 bg-cream-50 px-4 py-2.5 text-sm text-espresso-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-espresso-700">
              Favourite Brew Methods
            </label>
            <BrewMethodSelect
              selected={form.favouriteBrewMethods}
              onChange={(methods) => setForm({ ...form, favouriteBrewMethods: methods })}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-full bg-terracotta-600 px-6 py-2.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-terracotta-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="rounded-full border border-cream-300 px-6 py-2.5 text-sm font-medium text-espresso-600 transition-colors hover:bg-cream-50 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <p className="text-sm font-medium text-espresso-500">Username</p>
            <p className="text-espresso-900">{data.username || "Not set"}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-espresso-500">Email</p>
            <p className="text-espresso-900">{data.email}</p>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-espresso-500">
              Favourite Brew Methods
            </p>
            {data.favouriteBrewMethods.length > 0 ? (
              <BrewMethodSelect
                selected={data.favouriteBrewMethods}
                onChange={() => {}}
                disabled
              />
            ) : (
              <p className="text-sm text-espresso-400">No brew methods selected</p>
            )}
          </div>

          <button
            onClick={() => {
              setForm(data);
              setEditing(true);
            }}
            className="rounded-full bg-terracotta-600 px-6 py-2.5 text-sm font-semibold text-cream-50 transition-colors hover:bg-terracotta-700"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}
