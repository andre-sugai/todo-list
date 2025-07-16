import { Button } from '@/components/ui/button';
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from '@/components/ui/command';
import { Plus, Sparkles } from 'lucide-react';
import React, { useState } from 'react';

interface CommandAddTaskProps {
  onAdd: (task: string) => void;
  suggestions?: string[];
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

/**
 * Componente para adicionar tarefas usando o Command da Shadcn UI.
 * - Campo de busca/input integrado
 * - Sugestões de tarefas comuns
 * - Adiciona tarefa pressionando Enter ou clicando
 * - Placeholder dinâmico
 * - Ícones e animações suaves
 * - Visual responsivo
 *
 * @param onAdd Função chamada ao adicionar uma tarefa
 * @param suggestions Lista de sugestões de tarefas
 */
export const CommandAddTask: React.FC<CommandAddTaskProps> = ({
  onAdd,
  suggestions = [],
  inputRef,
}) => {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const placeholders = [
    'Adicionar nova tarefa...',
    'O que precisa ser feito?',
    'Ex: Comprar pão',
    'Ex: Estudar React',
    'Ex: Ligar para o cliente',
  ];
  const [placeholder, setPlaceholder] = useState(placeholders[0]);

  React.useEffect(() => {
    // Troca o placeholder a cada 3s
    const id = setInterval(() => {
      setPlaceholder((prev) => {
        const idx = placeholders.indexOf(prev);
        return placeholders[(idx + 1) % placeholders.length];
      });
    }, 3000);
    return () => clearInterval(id);
  }, []);

  function handleAdd(task: string) {
    if (!task.trim()) return;
    onAdd(task.trim());
    setInput('');
    setShowSuggestions(false);
  }

  function handleInputChange(val: string) {
    setInput(val);
    setShowSuggestions(val.length > 0);
  }

  return (
    <Command className="w-full animate-fade-in">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd(input);
        }}
        className="flex gap-2 items-center"
      >
        <span className="text-muted-foreground pl-1">
          {/* <Search className="w-4 h-4" /> */}
        </span>
        <CommandInput
          value={input}
          onValueChange={handleInputChange}
          placeholder={placeholder}
          className="flex-1"
          autoFocus
          onFocus={() => setShowSuggestions(input.length > 0)}
          ref={inputRef}
        />
        <Button
          type="submit"
          size="icon"
          variant="default"
          aria-label="Adicionar tarefa"
          disabled={!input.trim()}
        >
          <Plus className="w-5 h-5" />
        </Button>
      </form>
      {suggestions.length > 0 && showSuggestions && (
        <CommandList className="mt-2 max-h-40 overflow-y-auto animate-fade-in">
          {suggestions
            .filter(
              (s) =>
                s.toLowerCase().includes(input.toLowerCase()) &&
                s.toLowerCase() !== input.toLowerCase()
            )
            .slice(0, 5)
            .map((s, _) => (
              <CommandItem
                key={s}
                onSelect={() => handleAdd(s)}
                className="flex items-center gap-2 cursor-pointer hover:bg-accent transition-colors"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                {s}
              </CommandItem>
            ))}
          <CommandEmpty>Nenhuma sugestão encontrada.</CommandEmpty>
        </CommandList>
      )}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.4s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </Command>
  );
};
