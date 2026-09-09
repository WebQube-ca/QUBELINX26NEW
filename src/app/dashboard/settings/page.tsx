import { requireProfile } from "@/lib/auth";
import { getUserById } from "@/lib/data/store";
import { SettingsClient } from "@/components/dashboard/settings-client";

export default async function SettingsPage() {
  const { user, profile } = await requireProfile();
  const account = await getUserById(user.id);
  if (!account) throw new Error("Account missing");

  return (
    <SettingsClient user={user} profile={profile} account={account} />
  );
}
