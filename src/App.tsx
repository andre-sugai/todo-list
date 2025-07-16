import { HelpDialogContent } from './components/ui/HelpDialogContent';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
  CommandSeparator,
  CommandDialog,
} from './components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './components/ui/dialog';
import { Input } from './components/ui/input';
import { Separator } from './components/ui/separator';
import { Switch } from './components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './components/ui/tooltip';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
  Sun,
  Moon,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

/**
 * Representa uma tarefa da lista.
 * @property id - Identificador único da tarefa
 * @property texto - Descrição da tarefa
 * @property concluida - Status de conclusão
 * @property criadaEm - Data/hora de criação
 */
export interface Todo {
  id: number;
  texto: string;
  concluida: boolean;
  criadaEm: string;
}

type Filtro = 'todas' | 'pendentes' | 'concluidas';

const STORAGE_KEY = 'todos-shadcn';

const App: React.FC = () => {
  // Estado das tarefas
  const [todos, setTodos] = useState<Todo[]>([]);
  // Estado do filtro
  const [filtro, setFiltro] = useState<Filtro>('todas');
  // Estado do modal de adicionar tarefa
  const [open, setOpen] = useState(false);
  // Estado do input de nova tarefa
  const [novaTarefa, setNovaTarefa] = useState('');
  // Estado de edição
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [textoEdicao, setTextoEdicao] = useState('');
  // Tema
  const [dark, setDark] = useState(false);
  // Ref para input de edição
  const inputEdicaoRef = useRef<HTMLInputElement>(null);
  // Estado do placeholder dinâmico
  const [placeholder, setPlaceholder] = useState('Digite a nova tarefa...');
  // Estado para abrir o CommandDialog na seção de ajuda
  const [helpOpen, setHelpOpen] = useState(false);
  // Novo modal de ajuda
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [tarefaSelecionada, setTarefaSelecionada] = useState<number | null>(
    null
  );

  // Carregar tarefas do localStorage ao iniciar
  useEffect(() => {
    const salvos = localStorage.getItem(STORAGE_KEY);
    if (salvos) setTodos(JSON.parse(salvos));
  }, []);

  // Salvar tarefas no localStorage sempre que mudarem
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  // Foco automático no input de edição
  useEffect(() => {
    if (editandoId !== null) inputEdicaoRef.current?.focus();
  }, [editandoId]);

  // Alternância de tema
  useEffect(() => {
    const html = document.documentElement;
    if (dark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [dark]);

  // Atalho Ctrl+K / Cmd+K para abrir o CommandDialog
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Abrir CommandDialog já focado na ajuda
  useEffect(() => {
    if (helpOpen) {
      setOpen(true);
      setTimeout(() => {
        const helpItem = document.getElementById('command-help-item');
        if (helpItem) helpItem.focus();
      }, 100);
      setHelpOpen(false);
    }
  }, [helpOpen]);

  // Sugestões de tarefas
  const sugestoes = [
    'Comprar leite',
    'Estudar React',
    'Fazer exercícios',
    'Ler um livro',
    'Organizar a mesa',
  ];

  /**
   * Adiciona uma nova tarefa à lista.
   * @param texto Texto da tarefa
   */
  function adicionarTarefa(texto: string) {
    if (!texto.trim()) return;
    const nova: Todo = {
      id: Date.now(),
      texto: texto.trim(),
      concluida: false,
      criadaEm: new Date().toISOString(),
    };
    setTodos([nova, ...todos]);
  }

  /**
   * Alterna o status de conclusão de uma tarefa.
   * @param id ID da tarefa
   */
  function alternarConclusao(id: number) {
    setTodos((todos) =>
      todos.map((t) => (t.id === id ? { ...t, concluida: !t.concluida } : t))
    );
  }

  /**
   * Remove uma tarefa da lista.
   * @param id ID da tarefa
   */
  function deletarTarefa(id: number) {
    setTodos((todos) => todos.filter((t) => t.id !== id));
  }

  /**
   * Inicia edição de uma tarefa.
   * @param id ID da tarefa
   * @param texto Texto atual
   */
  function iniciarEdicao(id: number, texto: string) {
    setEditandoId(id);
    setTextoEdicao(texto);
  }

  /**
   * Salva a edição da tarefa.
   */
  function salvarEdicao() {
    if (editandoId === null) return;
    setTodos((todos) =>
      todos.map((t) =>
        t.id === editandoId ? { ...t, texto: textoEdicao.trim() || t.texto } : t
      )
    );
    setEditandoId(null);
    setTextoEdicao('');
  }

  /**
   * Cancela a edição.
   */
  function cancelarEdicao() {
    setEditandoId(null);
    setTextoEdicao('');
  }

  /**
   * Filtra as tarefas conforme o filtro selecionado.
   */
  function filtrarTarefas(todos: Todo[]) {
    switch (filtro) {
      case 'pendentes':
        return todos.filter((t) => !t.concluida);
      case 'concluidas':
        return todos.filter((t) => t.concluida);
      default:
        return todos;
    }
  }

  // Contadores
  const total = todos.length;
  const pendentes = todos.filter((t) => !t.concluida).length;
  const concluidas = todos.filter((t) => t.concluida).length;

  // Atalhos globais de teclado
  useEffect(() => {
    function handleGlobalKeyDown(e: KeyboardEvent) {
      // Não interferir em inputs/modais abertos
      const tag = (e.target as HTMLElement)?.tagName;
      const isInput =
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        (e.target as HTMLElement)?.isContentEditable;
      if (isInput && !open && !helpModalOpen) return;

      // Ctrl+K / Cmd+K: abrir Command
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(true);
        setTarefaSelecionada(null);
        return;
      }
      // Escape: fechar modais/cancelar edição
      if (e.key === 'Escape') {
        if (open) setOpen(false);
        if (helpModalOpen) setHelpModalOpen(false);
        if (editandoId !== null) cancelarEdicao();
        return;
      }
      // Enter: confirmar ação
      if (e.key === 'Enter') {
        if (editandoId !== null) {
          salvarEdicao();
          return;
        }
        if (open && novaTarefa.trim()) {
          adicionarTarefa(novaTarefa);
          setNovaTarefa('');
          setOpen(false);
          return;
        }
      }
      // Delete: deletar tarefa selecionada
      if (e.key === 'Delete' && tarefaSelecionada !== null) {
        deletarTarefa(tarefaSelecionada);
        setTarefaSelecionada(null);
        return;
      }
      // Espaço: marcar/desmarcar checkbox
      const isInputField =
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        (e.target as HTMLElement)?.isContentEditable;
      if (e.key === ' ' && tarefaSelecionada !== null && !isInputField) {
        e.preventDefault();
        alternarConclusao(tarefaSelecionada);
        return;
      }
      // Setas: navegar tarefas
      if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        const visiveis = filtrarTarefas(todos);
        if (!visiveis.length) return;
        let idx = visiveis.findIndex((t) => t.id === tarefaSelecionada);
        if (e.key === 'ArrowDown')
          idx = idx < visiveis.length - 1 ? idx + 1 : 0;
        if (e.key === 'ArrowUp') idx = idx > 0 ? idx - 1 : visiveis.length - 1;
        setTarefaSelecionada(visiveis[idx].id);
        return;
      }
      // Ctrl+1/2/3: alternar filtros
      if (e.ctrlKey && ['1', '2', '3'].includes(e.key)) {
        e.preventDefault();
        if (e.key === '1') setFiltro('todas');
        if (e.key === '2') setFiltro('pendentes');
        if (e.key === '3') setFiltro('concluidas');
        setTarefaSelecionada(null);
        return;
      }
    }
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [
    open,
    helpModalOpen,
    editandoId,
    novaTarefa,
    tarefaSelecionada,
    todos,
    filtro,
  ]);

  // Renderização
  return (
    <TooltipProvider>
      <div className="min-h-screen flex items-center justify-center p-2 sm:p-4 bg-background">
        <div className="w-full max-w-full sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto">
          <div className="bg-card rounded-2xl shadow-lg border border-border flex flex-col lg:flex-row gap-4 md:gap-8 p-2 sm:p-4 md:p-8 min-h-[70vh]">
            {/* Sidebar de filtros (desktop) */}
            <aside className="hidden lg:flex flex-col gap-4 w-56 py-4 pr-2 border-r border-border">
              <h2 className="text-lg font-semibold mb-2">Filtros</h2>
              <nav className="flex flex-col gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={filtro === 'todas' ? 'default' : 'outline'}
                      size="sm"
                      className="justify-between"
                      onClick={() => setFiltro('todas')}
                      aria-label="Todas as tarefas"
                    >
                      Todas
                      <Badge className="ml-2" variant="secondary">
                        {total}
                      </Badge>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Ctrl+1</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={filtro === 'pendentes' ? 'default' : 'outline'}
                      size="sm"
                      className="justify-between"
                      onClick={() => setFiltro('pendentes')}
                      aria-label="Tarefas pendentes"
                    >
                      Pendentes
                      <Badge className="ml-2" variant="secondary">
                        {pendentes}
                      </Badge>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Ctrl+2</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={filtro === 'concluidas' ? 'default' : 'outline'}
                      size="sm"
                      className="justify-between"
                      onClick={() => setFiltro('concluidas')}
                      aria-label="Tarefas concluídas"
                    >
                      Concluídas
                      <Badge className="ml-2" variant="secondary">
                        {concluidas}
                      </Badge>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Ctrl+3</TooltipContent>
                </Tooltip>
              </nav>
            </aside>

            {/* Conteúdo principal */}
            <div className="flex-1 flex flex-col gap-4 md:gap-8">
              {/* Header */}
              <header className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 pb-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                    Todo List
                  </h1>
                  <Badge
                    variant="secondary"
                    className="ml-2 text-base md:text-lg"
                  >
                    {total}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {/* Botão Nova Tarefa */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => setOpen(true)}
                        className={`
                          flex items-center gap-2 px-4 py-2 rounded-lg border text-base font-semibold transition-colors
                          bg-white border-gray-200 text-gray-900 hover:bg-gray-50
                          dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700
                          shadow-sm min-h-[44px] md:min-h-[40px]
                          focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400
                        `}
                        style={{ minWidth: 0 }}
                        aria-label="Adicionar nova tarefa"
                      >
                        Insira uma tarefa
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Adicionar nova tarefa (Ctrl+K ou ⌘+K)
                    </TooltipContent>
                  </Tooltip>
                  {/* Botão de Help */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        aria-label="Ajuda"
                        onClick={() => setHelpModalOpen(true)}
                        className="min-h-[44px] md:min-h-[40px]"
                      >
                        <HelpCircle className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Ajuda e atalhos</TooltipContent>
                  </Tooltip>
                  {/* Botão de Toggle Tema */}
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Tema claro/escuro"
                    onClick={() => setDark((d) => !d)}
                    className="min-h-[44px] md:min-h-[40px]"
                  >
                    {dark ? (
                      <Sun className="w-5 h-5" />
                    ) : (
                      <Moon className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </header>

              {/* Filtros mobile/tablet */}
              <nav className="flex lg:hidden gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-thin">
                <Button
                  variant={filtro === 'todas' ? 'default' : 'outline'}
                  size="sm"
                  className="min-w-[120px] min-h-[44px] text-base"
                  onClick={() => setFiltro('todas')}
                >
                  Todas{' '}
                  <Badge className="ml-2" variant="secondary">
                    {total}
                  </Badge>
                </Button>
                <Button
                  variant={filtro === 'pendentes' ? 'default' : 'outline'}
                  size="sm"
                  className="min-w-[120px] min-h-[44px] text-base"
                  onClick={() => setFiltro('pendentes')}
                >
                  Pendentes{' '}
                  <Badge className="ml-2" variant="secondary">
                    {pendentes}
                  </Badge>
                </Button>
                <Button
                  variant={filtro === 'concluidas' ? 'default' : 'outline'}
                  size="sm"
                  className="min-w-[120px] min-h-[44px] text-base"
                  onClick={() => setFiltro('concluidas')}
                >
                  Concluídas{' '}
                  <Badge className="ml-2" variant="secondary">
                    {concluidas}
                  </Badge>
                </Button>
              </nav>

              <Separator className="hidden lg:block" />

              {/* Lista de tarefas */}
              <main
                role="main"
                aria-label="Lista de tarefas"
                className="flex-1 overflow-y-auto"
              >
                {filtrarTarefas(todos).length === 0 ? (
                  <div className="text-center text-muted-foreground py-12 md:py-16 select-none text-base md:text-lg">
                    <Sparkles className="mx-auto mb-2 w-8 h-8 opacity-60" />
                    Nenhuma tarefa encontrada.
                  </div>
                ) : (
                  <ul className="space-y-2 md:space-y-3">
                    {filtrarTarefas(todos).map((tarefa) => (
                      <li key={tarefa.id}>
                        <Card
                          className={`flex items-center gap-2 md:gap-3 px-2 md:px-4 py-2 md:py-3 group shadow-sm border border-border bg-background/80 transition-all duration-150 ${
                            tarefaSelecionada === tarefa.id
                              ? 'ring-2 ring-blue-600 border-blue-600 bg-blue-50 dark:bg-blue-900'
                              : ''
                          }`}
                          tabIndex={0}
                          aria-selected={tarefaSelecionada === tarefa.id}
                          onClick={() => setTarefaSelecionada(tarefa.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter')
                              iniciarEdicao(tarefa.id, tarefa.texto);
                          }}
                          role="option"
                          aria-label={tarefa.texto}
                        >
                          {/* Checkbox nativo para marcar/desmarcar tarefa */}
                          <span className="relative inline-block mr-2 align-middle">
                            <input
                              type="checkbox"
                              checked={tarefa.concluida}
                              onChange={() => alternarConclusao(tarefa.id)}
                              aria-label={
                                tarefa.concluida
                                  ? 'Desmarcar como concluída'
                                  : 'Marcar como concluída'
                              }
                              className="h-5 w-5 md:h-6 md:w-6 rounded-lg border-2 border-gray-300 bg-gray-200 appearance-none checked:bg-gray-200 checked:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors duration-150 align-middle flex items-center justify-center relative"
                            />
                            {tarefa.concluida && (
                              <svg
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                width="18"
                                height="18"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M5 10.5L9 14.5L15 7.5"
                                  stroke="#22c55e"
                                  strokeWidth="2.2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </span>
                          {editandoId === tarefa.id ? (
                            <Input
                              ref={inputEdicaoRef}
                              value={textoEdicao}
                              onChange={(e) => setTextoEdicao(e.target.value)}
                              onBlur={salvarEdicao}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') salvarEdicao();
                                if (e.key === 'Escape') cancelarEdicao();
                              }}
                              className="flex-1 mr-2 text-base md:text-lg min-h-[44px]"
                              aria-label="Editar tarefa"
                              maxLength={100}
                            />
                          ) : (
                            <span
                              className={`flex-1 mr-2 select-text break-words ${
                                tarefa.concluida
                                  ? 'line-through text-muted-foreground'
                                  : ''
                              } text-base md:text-lg`}
                              tabIndex={0}
                              role="textbox"
                              aria-label={tarefa.texto}
                              onDoubleClick={() =>
                                iniciarEdicao(tarefa.id, tarefa.texto)
                              }
                            >
                              {tarefa.texto}
                            </span>
                          )}
                          <div className="flex gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  aria-label="Editar"
                                  onClick={() =>
                                    iniciarEdicao(tarefa.id, tarefa.texto)
                                  }
                                  className="min-h-[44px] md:min-h-[40px]"
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Editar</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  aria-label="Deletar"
                                  onClick={() => deletarTarefa(tarefa.id)}
                                  className="min-h-[44px] md:min-h-[40px]"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Deletar</TooltipContent>
                            </Tooltip>
                          </div>
                        </Card>
                      </li>
                    ))}
                  </ul>
                )}
              </main>

              {/* CommandDialog como modal elegante */}
              <CommandDialog open={open} onOpenChange={setOpen}>
                <Command className="rounded-xl shadow-2xl backdrop-blur-md bg-background/80 border border-border animate-in fade-in-0 zoom-in-95">
                  <CommandInput
                    placeholder={placeholder}
                    value={novaTarefa}
                    onValueChange={setNovaTarefa}
                    onFocus={() =>
                      setPlaceholder(
                        'Ex: ' +
                          sugestoes[
                            Math.floor(Math.random() * sugestoes.length)
                          ]
                      )
                    }
                    onBlur={() => setPlaceholder('Digite a nova tarefa...')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        adicionarTarefa(novaTarefa);
                        setNovaTarefa('');
                        setOpen(false);
                      }
                    }}
                    autoFocus
                    maxLength={100}
                    aria-label="Nova tarefa"
                    className="min-h-[44px] text-base md:text-lg"
                  />
                  <CommandList>
                    <CommandEmpty>Nenhuma sugestão encontrada.</CommandEmpty>
                    <CommandGroup heading="Sugestões">
                      {sugestoes.map((s, i) => (
                        <CommandItem
                          key={i}
                          onSelect={() => {
                            adicionarTarefa(s);
                            setNovaTarefa('');
                            setOpen(false);
                          }}
                          className="cursor-pointer min-h-[44px] text-base md:text-lg"
                        >
                          <Plus className="w-4 h-4 mr-2" /> {s}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandItem
                      id="command-help-item"
                      onSelect={() => {
                        // Exibir painel de ajuda/atalhos
                        alert(
                          'Atalhos e recursos:\n\n- Ctrl+K / ⌘+K: Abrir Command\n- Esc: Fechar\n- Setas: Navegar\n- Enter: Selecionar\n- Adicionar, buscar, editar, deletar tarefas, ações globais, filtros, etc.'
                        );
                        setOpen(false);
                      }}
                      className="cursor-pointer min-h-[44px] text-base md:text-lg font-semibold"
                    >
                      <HelpCircle className="w-4 h-4 mr-2" /> Ajuda e atalhos
                    </CommandItem>
                    <CommandItem
                      onSelect={() => {
                        adicionarTarefa(novaTarefa);
                        setNovaTarefa('');
                        setOpen(false);
                      }}
                      className="cursor-pointer min-h-[44px] text-base md:text-lg font-semibold"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Adicionar "
                      {novaTarefa || '...'}"
                    </CommandItem>
                  </CommandList>
                </Command>
              </CommandDialog>
            </div>
          </div>
        </div>
      </div>
      {/* Novo modal de ajuda */}
      <Dialog open={helpModalOpen} onOpenChange={setHelpModalOpen}>
        <HelpDialogContent className="help-modal-bg help-modal-content">
          <DialogPrimitive.Close asChild>
            <button className="close-modal-btn" aria-label="Fechar modal">
              <X className="w-6 h-6" />
            </button>
          </DialogPrimitive.Close>
          <DialogHeader>
            <DialogTitle className="dialog-title">
              Ajuda e Atalhos do Command
            </DialogTitle>
            <DialogDescription>
              Veja abaixo as principais funções e atalhos disponíveis no
              Command:
            </DialogDescription>
          </DialogHeader>
          <ul className="space-y-2 mt-4 text-base">
            <li>
              <kbd className="px-2 py-1 bg-muted rounded border font-mono">
                Ctrl+K
              </kbd>{' '}
              ou{' '}
              <kbd className="px-2 py-1 bg-muted rounded border font-mono">
                ⌘+K
              </kbd>
              : Abrir o Command
            </li>
            <li>
              <kbd className="px-2 py-1 bg-muted rounded border font-mono">
                Esc
              </kbd>
              : Fechar o Command
            </li>
            <li>
              <kbd className="px-2 py-1 bg-muted rounded border font-mono">
                ↑
              </kbd>
              /
              <kbd className="px-2 py-1 bg-muted rounded border font-mono">
                ↓
              </kbd>
              : Navegar entre opções
            </li>
            <li>
              <kbd className="px-2 py-1 bg-muted rounded border font-mono">
                Enter
              </kbd>
              : Selecionar opção
            </li>
            <li>
              Adicionar tarefa rapidamente digitando e pressionando{' '}
              <kbd className="px-2 py-1 bg-muted rounded border font-mono">
                Enter
              </kbd>
            </li>
            <li>Selecionar sugestões de tarefas</li>
            <li>
              Editar, deletar e marcar tarefas como concluídas diretamente na
              lista
            </li>
          </ul>
        </HelpDialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default App;
