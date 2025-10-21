-- permite que usuários autenticados criem seus planos
CREATE POLICY "Usuarios autenticados podem criar planos" ON public.lesson_plans
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Permite que os usuários vejam seus proprios planos
CREATE POLICY "usuarios podem ver seus proprios planos" ON public.lesson_plans
FOR SELECT USING (auth.uid() = user_id);