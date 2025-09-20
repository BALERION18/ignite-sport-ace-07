-- Add sports field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN sports TEXT[] DEFAULT '{}';

-- Add index for sports array for better performance
CREATE INDEX idx_profiles_sports ON public.profiles USING GIN(sports);