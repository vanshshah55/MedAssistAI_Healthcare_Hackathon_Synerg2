import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aqlbwwwlmvowdmrgvaum.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxbGJ3d3dsbXZvd2Rtcmd2YXVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4NDIxODgsImV4cCI6MjA1NjQxODE4OH0.X8gfEy-7MDR1jyoUu7XrsKv86EawKd409F9puv87U-Y'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 