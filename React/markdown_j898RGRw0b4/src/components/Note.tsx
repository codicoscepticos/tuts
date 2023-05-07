import { NoteData } from "../Types";
import NoteForm from "./NoteForm";

interface NoteProps{
  onSubmit: (data:NoteData) => void
}

export default function Note({onSubmit}:NoteProps) {
  return (<>
    <h1 className="header">New Note</h1>
    <NoteForm onSubmit={onSubmit} />
  </>)
}
