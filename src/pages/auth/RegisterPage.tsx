import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/auth.store';
import { useUIStore } from '@/store/ui.store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ROUTES } from '@/constants/routes';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Mínimo 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As passwords não coincidem',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const addToast = useUIStore((s) => s.addToast);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setAuth(response.user, response.accessToken);
      addToast({
        type: 'success',
        title: 'Conta criada!',
        message: `Bem-vindo, ${response.user.name}!`,
      });
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch {
      addToast({
        type: 'error',
        title: 'Erro ao criar conta',
        message: 'Este email pode já estar em uso.',
      });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Criar conta</h2>
      <p className="text-sm text-gray-500 mb-6">Começa a gerir as tuas finanças</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nome"
          type="text"
          placeholder="O teu nome"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Email"
          type="email"
          placeholder="nome@email.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Mínimo 8 caracteres"
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="Confirmar password"
          type="password"
          placeholder="Repete a password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <Button
          type="submit"
          className="w-full"
          isLoading={isSubmitting}
        >
          Criar conta
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Já tens conta?{' '}
        <Link to={ROUTES.LOGIN} className="text-primary-600 font-medium hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
