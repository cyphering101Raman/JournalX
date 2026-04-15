import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import JournalWorkspace from "@/app/components/JournalWorkspace";

export default async function JournalEditorPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("auth-session");

  // Authentication Check
  if (!session?.value) {
    redirect("/login");
  }

  return (
    <div className="flex w-full h-screen pt-16 overflow-hidden">
      <JournalWorkspace />
    </div>
  );
}
