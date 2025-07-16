/**
 * Checkbox customizado baseado em Radix UI, utilizado para alternar o status de conclusão de tarefas.
 *
 * Props:
 * - className: classes adicionais para customização
 * - ...props: demais propriedades do Checkbox do Radix
 *
 * Retorno:
 * - Um componente visual de checkbox simples: borda cinza no estado normal, borda preta e check preto quando marcado.
 */

import { cn } from '@/lib/utils';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import * as React from 'react';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      // Simples: borda cinza normal, preta quando marcado
      'peer h-7 w-7 md:h-8 md:w-8 shrink-0 rounded-lg border-2 border-gray-300 bg-white transition-colors duration-150 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:border-gray-500 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-black',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn('flex items-center justify-center w-full h-full')}
    >
      <Check className="h-5 w-5 md:h-6 md:w-6 text-black" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
