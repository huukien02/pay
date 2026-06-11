"use server"

import { actionClient } from "@/lib/safe-action"
import { createClient } from "@/lib/supabase/server"

export const logoutAction = actionClient.action(async () => {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return { ok: true as const }
})
