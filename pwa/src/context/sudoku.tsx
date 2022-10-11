import { createSignal, createContext, useContext, Setter, Accessor } from "solid-js";

type SudokuStore = {
  board: Accessor<number[]>,
  options: Accessor<number[][]>,
  setBoardValue: (index: number, value: number) => void,
  addOption: (index: number, option: number) => void,
  removeOption: (index: number, option: number) => void,
  toggleOption: (index: number, option: number) => void,
  onInput: (value: number) => void,
  setSelectedCell: Setter<number>,
  selectedCell: Accessor<number>,
  setEditingOptions: Setter<boolean>,
  editingOptions: Accessor<boolean>,
}

const SudokuContext = createContext<SudokuStore | null>(null);

export function SudokuProvider(props: any) {
  const [board, setBoard] = createSignal<number[]>(Array.from(Array(81)).map(() => 0));
  const [options, setOptions] = createSignal<number[][]>(Array.from(Array(81)).map(() => []));
  const [selectedCell, setSelectedCell] = createSignal<number>(-1);
  const [editingOptions, setEditingOptions] = createSignal<boolean>(false);

  const setBoardValue = (index: number, value: number) => {
    if (index < 0 || index > 80)
      return;
    setBoard(old => [...old.slice(0, index), value, ...old.slice(index + 1)]);
  }

  const addOption = (index: number, option: number) => {
    if (index < 0 || index > 80)
      return;
    setOptions(old => [...old.slice(0, index), [...old[index], option], ...old.slice(index + 1)])
  }

  const removeOption = (index: number, option: number) => {
    if (index < 0 || index > 80)
      return;
    setOptions(old => [...old.slice(0, index), [...old[index].filter(v => v != option)], ...old.slice(index + 1)])
  }

  const toggleOption = (index: number, option: number) => {
    options()[index].includes(option) ? removeOption(index, option) : addOption(index, option)
    
    console.log(options()[index])
  }

  const onInput = (value: number) => {
    if (editingOptions())
      toggleOption(selectedCell(), value)
    else
      setBoardValue(selectedCell(), value);
  }

  const store: SudokuStore = {
    board,
    options,
    setBoardValue,
    addOption,
    removeOption,
    toggleOption,
    onInput,
    setSelectedCell,
    selectedCell,
    setEditingOptions,
    editingOptions
  };

  store.setBoardValue(15, 5);
  store.setBoardValue(18, 6);
  store.setBoardValue(27, 7);
  store.addOption(65, 7);
  store.addOption(65, 3);
  store.addOption(65, 2);
  store.addOption(69, 1);
  store.addOption(69, 8);

  return (
    <SudokuContext.Provider value={store}>
      {props.children}
    </SudokuContext.Provider>
  );
}

export const useSudoku = () => {
  const sudoku = useContext(SudokuContext);
  if (!sudoku)
    throw new Error('Sudoku is undefined! Must be used from within a Sudoku Provider!');
  return sudoku;
};