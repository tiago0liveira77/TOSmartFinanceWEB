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

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const addToast = useUIStore((s) => s.addToast);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await authApi.login(data);
      setAuth(response.user, response.accessToken);
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch {
      addToast({
        type: 'error',
        title: 'Erro ao entrar',
        message: 'Email ou password incorretos.',
      });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">Bem-vindo de volta</h2>
      <p className="text-sm text-gray-500 mb-6">Inicia sessão na tua conta</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button
          type="submit"
          className="w-full"
          isLoading={isSubmitting}
        >
          Entrar
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Ainda não tens conta?{' '}
        <Link to={ROUTES.REGISTER} className="text-primary-600 font-medium hover:underline">
          Regista-te
        </Link>
      </p>
    </div>
  );
}
