-- Lesson Plans table
CREATE TABLE IF NOT EXISTS public.lesson_plans (
    id uuid PRIMARY KEY  default uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    lesson_theme text NOT NULL, -- Tema da aula
    discipline text NOT NULL, -- Disciplina, (Ex: 'Português')
    grade text NOT NULL, -- Série / Ano
    bncc_codes text NOT NULL, -- Codigos da Habilidade do BNCC
    duration text, -- Duração estimada (Ex: 2 aulas)
    teaching_level VARCHAR(40), -- Nivel do ensino (Ex: 'Fundamental', 'Médio')
    extra_objective TEXT, 

    introdution_ludic text,
    bncc_learning_objectives text,
    activity_step_by_step TEXT,
    assessment_rubric text,

    full_prompt_sent text,
    generated_plan JSONB not null,
    created_at TIMESTAMP with time zone DEFAULT now() NOT NULL


);

-- habilitar RLS
ALTER TABLE lesson_plans ENABLE ROW LEVEL SECURITY;
