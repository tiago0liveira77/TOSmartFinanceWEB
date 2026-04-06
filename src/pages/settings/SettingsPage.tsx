import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { useUpdateProfile, useChangePassword } from '@/hooks/useAuth';
import { useUIStore } from '@/store/ui.store';
import { authApi } from '@/api/auth.api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ROUTES } from '@/constants/routes';

const profileSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres').max(255),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Campo obrigatório'),
    newPassword: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string().min(1, 'Campo obrigatório'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'As palavras-passe não coincidem',
    path: ['confirmPassword'],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

function ProfileSection() {
  const user = useAuthStore((s) => s.user);
  const addToast = useUIStore((s) => s.addToast);
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const [editing, setEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? '' },
  });

  const onSubmit = (data: ProfileFormData) => {
    updateProfile(data, {
      onSuccess: () => {
        addToast({ type: 'success', title: 'Perfil actualizado' });
        setEditing(false);
      },
      onError: () => addToast({ type: 'error', title: 'Erro ao actualizar perfil' }),
    });
  };

  const handleCancel = () => {
    reset({ name: user?.name ?? '' });
    setEditing(false);
  };

  return (
    <Card title="Perfil">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
            {user?.name?.charAt(0).toUpperCase() ?? '?'}
          </div>
          <div>
            <p className="font-medium text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        {editing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 pt-2 border-t border-gray-100">
            <Input
              label="Nome"
              error={errors.name?.message}
              {...register('name')}
            />
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="secondary" size="sm" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button type="submit" size="sm" isLoading={isPending}>
                Guardar
              </Button>
            </div>
          </form>
        ) : (
          <div className="pt-2 border-t border-gray-100">
            <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
              Editar nome
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

function PasswordSection() {
  const addToast = useUIStore((s) => s.addToast);
  const { mutate: changePassword, isPending } = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = (data: PasswordFormData) => {
    changePassword(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      {
        onSuccess: () => {
          addToast({ type: 'success', title: 'Palavra-passe alterada' });
          reset();
        },
        onError: () =>
          addToast({ type: 'error', title: 'Erro ao alterar palavra-passe', message: 'Verifica a palavra-passe actual.' }),
      }
    );
  };

  return (
    <Card title="Segurança">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm">
        <Input
          label="Palavra-passe actual"
          type="password"
          autoComplete="current-password"
          error={errors.currentPassword?.message}
          {...register('currentPassword')}
        />
        <Input
          label="Nova palavra-passe"
          type="password"
          autoComplete="new-password"
          error={errors.newPassword?.message}
          {...register('newPassword')}
        />
        <Input
          label="Confirmar nova palavra-passe"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <Button type="submit" variant="secondary" size="sm" isLoading={isPending}>
          Alterar palavra-passe
        </Button>
      </form>
    </Card>
  );
}

function DangerZone() {
  const navigate = useNavigate();
  const addToast = useUIStore((s) => s.addToast);
  const logout = useAuthStore((s) => s.logout);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore — clear local state regardless
    }
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <Card title="Conta">
      <div className="space-y-3">
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium text-gray-700">Terminar sessão</p>
            <p className="text-xs text-gray-500">Sai da tua conta neste dispositivo</p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setLogoutOpen(true)}>
            Terminar sessão
          </Button>
        </div>
      </div>

      <Modal isOpen={logoutOpen} onClose={() => setLogoutOpen(false)} title="Terminar sessão">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Tens a certeza que queres terminar a sessão?</p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setLogoutOpen(false)}>Cancelar</Button>
            <Button variant="danger" onClick={handleLogout}>Terminar sessão</Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
}

export function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-lg font-semibold text-gray-900">Definições</h2>
      <ProfileSection />
      <PasswordSection />
      <DangerZone />
    </div>
  );
}
