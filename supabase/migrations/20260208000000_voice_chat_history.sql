create table if not exists voice_chat_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  user_message text not null,
  ai_response text not null,
  language text default 'en-US',
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table voice_chat_history enable row level security;

-- Create policies
create policy "Users can view their own voice chat history"
  on voice_chat_history for select
  using (auth.uid() = user_id);

create policy "Users can insert their own voice chat history"
  on voice_chat_history for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own voice chat history"
  on voice_chat_history for delete
  using (auth.uid() = user_id);

-- Create index
create index voice_chat_history_user_id_idx on voice_chat_history(user_id);
create index voice_chat_history_created_at_idx on voice_chat_history(created_at desc);
