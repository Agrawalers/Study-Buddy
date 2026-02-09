-- Add schedule_date and ai_prompt columns to study_plans
ALTER TABLE public.study_plans 
ADD COLUMN schedule_date DATE,
ADD COLUMN ai_prompt TEXT,
ADD COLUMN is_ai_generated BOOLEAN DEFAULT false;

-- Update existing records to have schedule_date based on day_of_week
UPDATE public.study_plans 
SET schedule_date = CURRENT_DATE + (day_of_week - EXTRACT(DOW FROM CURRENT_DATE))::INTEGER
WHERE schedule_date IS NULL;
