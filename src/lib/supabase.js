import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://mlpexlmqiduhlzpadlhb.supabase.co"
const supabaseKey = "sb_publishable_iIZ97hjXAJZOs4aWyPItbw_cPOTd6hy"

export const supabase = createClient(supabaseUrl, supabaseKey)