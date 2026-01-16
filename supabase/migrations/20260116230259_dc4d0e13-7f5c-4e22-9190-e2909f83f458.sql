-- Add whatsapp_message column to services table for custom messages per service
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS whatsapp_message TEXT;