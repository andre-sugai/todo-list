import { cn } from '@/lib/utils';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import * as React from 'react';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      // Fundo e borda customizados para contraste
      'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
      // Fundo desativado
      'bg-gray-200 border-gray-300',
      // Fundo ativado
      'data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500',
      // Fundo dark desativado
      'dark:bg-gray-700 dark:border-gray-600',
      // Fundo dark ativado
      'dark:data-[state=checked]:bg-green-500 dark:data-[state=checked]:border-green-500',
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        // Círculo interno com contraste
        'pointer-events-none block h-4 w-4 rounded-full shadow-lg ring-0 transition-transform',
        // Círculo branco quando desativado
        'bg-white',
        // Círculo preto quando ativado
        'data-[state=checked]:bg-black',
        // Círculo branco no dark quando desativado
        'dark:bg-white',
        // Círculo preto no dark quando ativado
        'dark:data-[state=checked]:bg-black',
        // Movimento do thumb
        'data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0'
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
