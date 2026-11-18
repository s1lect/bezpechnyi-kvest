/** Крок завершено. firstTry: true — з першої спроби, false — з помилками, null — крок без оцінювання. */
export type Done = (firstTry: boolean | null) => void;
