-- permite inserções publicas
create policy "Allow public insert"
on public.lesson_plans
for insert
with check (true);
