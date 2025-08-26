import { z } from 'zod';

// Define o schema de validação para o formulário de cadastro
export const registerFormSchema = z.object({
    name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
    email: z.email('Formato de e-mail inválido.'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
    confirm_password: z.string(),
    age: z.string('A idade deve ser um número inteiro.'),
    sex: z.enum(['MASCULINO', 'FEMININO']),
    height: z.string('A altura deve ser positiva.'),
    weight: z.string('O peso deve ser positivo.'),
}).refine(data => data.password === data.confirm_password, {
    message: "As senhas não coincidem.",
    path: ["confirm_password"],
});

// Extrai o tipo dos dados do formulário a partir do schema
export type RegisterFormData = z.infer<typeof registerFormSchema>;