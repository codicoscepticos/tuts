import { useState, useMemo } from 'react'
import {
  RouterProvider,
  Navigate,
  createBrowserRouter,
  Routes,
  Route
} from 'react-router-dom'
import './App.css'
import Note from './components/Note';
import { NoteData, RawNote, Tag } from './Types';
import { useLocalStorage } from './hooks/useLocalStorage';
import {v4 as uuidV4} from 'uuid';

const router = createBrowserRouter([
  {
    path: '/',
    element: <h1>Hello</h1>
  },
  {
    path: '/new',
    element: <h1>Note</h1>//<Note />
  },
  {
    path: '/:id',
    children: [
      {
        index: true,
        element: <h1>Show</h1>
      },
      {
        path: 'edit',
        element: <h1>Edit</h1>
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to='/' />
  }
]);

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>('NOTES', []);
  const [tags, setTags] = useLocalStorage<Tag[]>('TAGS', []);
  
  const notesWithTags = useMemo(() => {
    return notes.map(note => {
      return {
        ...note,
        tags: tags.filter(tag => note.tagIds.includes(tag.id))
      }
    })
  }, [notes, tags]);
  
  function onCreateNote({tags, ...data}:NoteData){
    setNotes(prevNotes => {
      return [
        ...prevNotes,
        {
          ...data,
          id: uuidV4(),
          tagIds: tags.map(tag => tag.id)
        }
      ]
    })
  }
  
  return (
    <Routes>
      <Route path='/' element={<h1>Hello</h1>} />
      <Route path='/new' element={<Note onSubmit={onCreateNote} />} />
      <Route path='/:id'>
        <Route index element={<h1>Show</h1>} />
        <Route path='edit' element={<h1>Edit</h1>} />
      </Route>
    </Routes>
  );
}

export default App
