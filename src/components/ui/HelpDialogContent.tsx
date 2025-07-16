import { cn } from '@/lib/utils';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as React from 'react';

/**
 * Componente de conteúdo de modal (Dialog) customizado para o modal de ajuda.
 * Não renderiza o botão padrão de fechar do Radix, permitindo uso de botão customizado.
 *
 * @param className Classes adicionais para estilização
 * @param children Conteúdo do modal
 * @param props Demais props do DialogPrimitive.Content
 * @returns JSX.Element
 */
const HelpDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg',
        className
      )}
      {...props}
    >
      {children}
      {/* Não renderiza o DialogPrimitive.Close padrão aqui! */}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
HelpDialogContent.displayName = 'HelpDialogContent';

export { HelpDialogContent };
