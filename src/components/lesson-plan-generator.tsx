"use client"
import { BookOpen, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import React, { useState } from "react";
import { Select } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { LessonPlan } from "@/lib/interfaces/lessonPlan";
import { GeneratedPlan } from "@/lib/interfaces/generatedPlan";
import { ApiError } from "@/lib/interfaces/apiError";
import { Separator } from "@radix-ui/react-select";

export default function LessonPlanGenerator() {
    const [formData, setFormData] = useState<LessonPlan>({
        theme: "",
        teaching_level: "",
        discipline: "",
        grade: "",
        bncc_codes: "",
        duration: "",
        extra_objective: ""
    });

    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null); 
    const [error, setError] = useState<string | null>(null);


    const handeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setGeneratedPlan(null);
        setIsGenerating(true);
        const dataToSend: LessonPlan = {
            ...formData
        }
        try {
            const response = await fetch("api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...dataToSend
                })
            })
            const result = await response.json()
            if (!response.ok) {
                const errorResult = result as ApiError;
                setError(errorResult.error || "Ocorreu um erro desconhecido ao gerar o plano.");
                if (errorResult.rawResponse) {
                    console.log("Resposta bruta da IA (para Debug): ", errorResult.rawResponse);
                }
                return;
            }

            const savedPlan = result.plan;
            setGeneratedPlan({
                introdution_ludic: savedPlan.introdution_ludic,
                bncc_learning_objectives: savedPlan.bncc_learning_objectives,
                activity_step_by_step: savedPlan.activity_step_by_step,
                assessment_rubric: savedPlan.assessment_rubric
            });

            
        } catch(err: any) {

        } finally{
            setIsGenerating(false);
        }
    }
    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-4xl md:text-5xl font-bold text-balance">Gerador de Planos de Aula com IA</h1>
                <p className="text-muted-foreground text-lg text-balance">Crie planos de aula personalizados e alinhados à BNCC em segundos</p>
            </div>
            {/* Input Form */}
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Gerar Novo Plano de Aula
                    </CardTitle>
                    <CardDescription>
                        Preencha os campos abaixo para gerar um novo plano de aula personalizado
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="teaching_level">Nível de Ensino</Label>
                            <Input
                                id="teaching_level"
                                name="teaching_level"
                                placeholder="Ex: Ensino Fundametal"
                                value={formData.teaching_level}
                                onChange={handeInputChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="discipline">Disciplina</Label>
                            <Input
                                id="discipline"
                                name="discipline"
                                placeholder="Ex: Português"
                                value={formData.discipline}
                                onChange={handeInputChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="grade">Série/Ano</Label>
                            <Input
                                id="grade"
                                name="grade"
                                placeholder="Ex: 5° Ano"
                                value={formData.grade}
                                onChange={handeInputChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="theme">Título/Tema da Aula</Label>
                            <Input
                                id="theme"
                                name="theme"
                                placeholder="Ex: Explorando o Sistema Solar"
                                value={formData.theme}
                                onChange={handeInputChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bncc_codes">Código(s) de Habilidades do BNCC</Label>
                            <Input
                                id="bncc_codes"
                                name="bncc_codes"
                                placeholder="Ex: EF05CI10, EF05CI11"
                                value={formData.bncc_codes}
                                onChange={handeInputChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duration">Duração Estimada</Label>
                            <Input
                                id="duration"
                                name="duration"
                                placeholder="Ex: 2 aulas ou 120 minutos"
                                value={formData.duration}
                                onChange={handeInputChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="extra_objective">Objetivos Extra (Opicional)</Label>
                            <Input
                                id="extra_objective"
                                name="extra_objective"
                                placeholder="Ex: 2 aulas ou 120 minutos"
                                value={formData.extra_objective}
                                onChange={handeInputChange}
                            />
                        </div>
                    </div>
                    <Button
                        onClick={handleGenerate}
                        disabled={
                            isGenerating ||
                            !formData.teaching_level ||
                            !formData.discipline ||
                            !formData.grade ||
                            !formData.theme ||
                            !formData.duration ||
                            !formData.bncc_codes
                        }
                        className="w-full md:w-auto"
                        size="lg">
                        <Sparkles className="mr-2 h-5 w-5" />
                        {isGenerating ? "Gerando..." : "Gerar Plano de Aula com IA"}
                    </Button>
                </CardContent>
            </Card>
            {/* Output Section */}
            {generatedPlan && (
                <Card className="shadow-lg border-2">
                    <CardHeader className="bg-muted/50">
                        <CardTitle className="text-2xl">
                            {formData.theme}
                        </CardTitle>
                        <CardDescription className="text-base">
                            {formData.teaching_level} - {formData.discipline} - {formData.bncc_codes}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        {/* Introduction */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary"/>
                                <h3 className="text-x1 font-semibold">Introdução Lúcida</h3>
                            </div>
                            <p className="text-muted-foreground leading-relaxed pl-7">{generatedPlan.introdution_ludic}</p>
                        </div>
                        <Separator/>
                        {/* Objetives */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary"/>
                                <h3 className="text-x1 font-semibold">Objetivo de Aprendizagem da BNCC</h3>
                            </div>
                            <p className="text-muted-foreground leading-relaxed pl-7">{generatedPlan.bncc_learning_objectives}</p>
                        </div>
                        <Separator/>
                        {/* Steps */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary"/>
                                <h3 className="text-x1 font-semibold">Passo a Passo da Atividade</h3>
                            </div>
                            <p className="text-muted-foreground leading-relaxed pl-7">{generatedPlan.activity_step_by_step}</p>
                        </div>
                        <Separator/>
                        {/* Steps */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary"/>
                                <h3 className="text-x1 font-semibold">Rubricas de Avaliação</h3>
                            </div>
                            <p className="text-muted-foreground leading-relaxed pl-7">{generatedPlan.assessment_rubric}</p>
                        </div>
                    </CardContent>
                </Card>
            )}
            {/* Footer */}
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground pt-4">
                <span>Powered By</span>
                <div className="flex items-center gap-2">
                    <span className="font-medium">Fabiano Amaral Alves</span>
                </div>
                <span> - </span>
                <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4"/>
                    <span className="font-medium">Google Gemini</span>
                </div>
            </div>
        </div>
    );
}