import { generateLessonPlan } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Database } from "../../../../database.types";
import { json } from "zod";
import { GeneratedPlan } from "@/lib/interfaces/generatedPlan";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient<Database>(supabaseUrl!, supabaseKey!);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { teaching_level,
    discipline,
    grade,
    theme,
    bncc_codes,
    duration,
    extra_objective } = body;
  const prompt = `Gere um Plano de Aula completo e detalhado com base nas seguintes especificações:
            - Nível de Ensino: ${teaching_level}
            - Disciplina: ${discipline}
            - Série/Ano: ${grade}
            - Tema da Aula: ${theme}
            - Habilidades BNCC Foco: ${bncc_codes}
            - Duração Estimada: ${duration}
            - Instruções/Objetivo Extra: ${extra_objective || 'Nenhuma instrução adicional.'}
            
            O JSON de saída deve seguir esta estrutura:
            {
              "introdution_ludic": "Texto da Introdução lúdica",
              "bncc_learning_objectives": "Texto do Objetivo de aprendizagem da BNCC (baseado nos códigos fornecidos)",
              "activity_step_by_step": "Roteiro detalhado de passos para a atividade",
              "assessment_rubric": "Critérios de avaliação para a professora"
            }
  Retorne apenas json valido em portugues`;
  const outputJson = JSON.parse(generateLessonPlan(prompt)) as GeneratedPlan;
  const { data, error: dbError } = await supabase.from('lesson_plans').insert([
    {
      discipline: discipline,
      grade: grade,
      theme: theme,
      bncc_codes: bncc_codes,
      duration: duration,
      teaching_level: teaching_level,
      extra_objective: extra_objective,

      introdution_ludic: outputJson.introdution_ludic,
      bncc_learning_objectives: outputJson.bncc_learning_objectives,
      activity_step_by_step: outputJson.activity_step_by_step,
      assessment_rubric: outputJson.assessment_rubric,

      full_prompt_sent: prompt,
      generated_plan: outputJson

    }
  ]).select().single();
    if (dbError) {
      console.error('Erro ao salvar no supabase: ', dbError);
      return NextResponse.json({error: 'Falha ao salvar plano no banco de dados.'})
    }

  return NextResponse.json({message: "Plano de aula gerado e salvo com sucesso", plan: data})
}