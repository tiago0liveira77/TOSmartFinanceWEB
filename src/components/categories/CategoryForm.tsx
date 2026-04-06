import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCreateCategory, useUpdateCategory } from '@/hooks/useCategories';
import { useUIStore } from '@/store/ui.store';
import type { Category } from '@/types/category.types';
import { cn } from '@/utils/cn';

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
];

const PRESET_ICONS = [
  '🛒', '🚗', '🏠', '❤️', '🎬', '📚',
  '👕', '💻', '✈️', '💼', '💰', '📈',
];

const categorySchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres').max(100, 'Máximo 100 caracteres'),
  type: z.enum(['INCOME', 'EXPENSE'], { required_error: 'Seleciona um tipo' }),
  icon: z.string().min(1, 'Seleciona um ícone'),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Cor inválida'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: Category;
  onSuccess: () => void;
}

export function CategoryForm({ category, onSuccess }: CategoryFormProps) {
  const addToast = useUIStore((s) => s.addToast);
  const { mutate: create, isPending: creating } = useCreateCategory();
  const { mutate: update, isPending: updating } = useUpdateCategory();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? '',
      type: (category?.type === 'INCOME' || category?.type === 'EXPENSE') ? category.type : 'EXPENSE',
      icon: category?.icon ?? PRESET_ICONS[0],
      color: category?.color ?? PRESET_COLORS[0],
    },
  });

  const selectedColor = watch('color');
  const selectedIcon = watch('icon');

  const onSubmit = (data: CategoryFormData) => {
    if (category) {
      update(
        { id: category.id, data },
        {
          onSuccess: () => {
            addToast({ type: 'success', title: 'Categoria actualizada' });
            onSuccess();
          },
          onError: () => addToast({ type: 'error', title: 'Erro ao actualizar categoria' }),
        }
      );
    } else {
      create(data, {
        onSuccess: () => {
          addToast({ type: 'success', title: 'Categoria criada' });
          onSuccess();
        },
        onError: () => addToast({ type: 'error', title: 'Erro ao criar categoria' }),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Nome"
        placeholder="Ex: Alimentação"
        error={errors.name?.message}
        {...register('name')}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
        <div className="flex gap-2">
          {(['EXPENSE', 'INCOME'] as const).map((t) => (
            <label key={t} className="flex-1">
              <input type="radio" value={t} {...register('type')} className="sr-only" />
              <div
                className={cn(
                  'flex items-center justify-center py-2 rounded-lg border text-sm font-medium cursor-pointer transition-colors',
                  watch('type') === t
                    ? t === 'EXPENSE'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                )}
              >
                {t === 'EXPENSE' ? '↓ Despesa' : '↑ Receita'}
              </div>
            </label>
          ))}
        </div>
        {errors.type && <p className="mt-1 text-xs text-red-600">{errors.type.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Ícone</label>
        <div className="grid grid-cols-6 gap-2">
          {PRESET_ICONS.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => setValue('icon', icon)}
              className={cn(
                'flex items-center justify-center h-9 rounded-lg border text-lg transition-colors',
                selectedIcon === icon
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:bg-gray-50'
              )}
            >
              {icon}
            </button>
          ))}
        </div>
        {errors.icon && <p className="mt-1 text-xs text-red-600">{errors.icon.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cor</label>
        <div className="flex gap-2 flex-wrap">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setValue('color', color)}
              className={cn(
                'w-8 h-8 rounded-full border-2 transition-transform',
                selectedColor === color ? 'border-gray-800 scale-110' : 'border-transparent'
              )}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
        {errors.color && <p className="mt-1 text-xs text-red-600">{errors.color.message}</p>}
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" className="flex-1" isLoading={creating || updating}>
          {category ? 'Guardar alterações' : 'Criar categoria'}
        </Button>
      </div>
    </form>
  );
}
