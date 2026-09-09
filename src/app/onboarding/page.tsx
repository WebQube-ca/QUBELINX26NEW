import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getProfileByUserId } from "@/lib/data/store";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export default async function OnboardingPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const profile = await getProfileByUserId(user.id);
  if (profile?.onboarding_completed) redirect("/dashboard");

  return <OnboardingWizard defaultName={user.full_name} />;
}
