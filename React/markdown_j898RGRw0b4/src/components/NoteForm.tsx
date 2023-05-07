import { ChangeEvent, FormEvent, useRef, useState } from 'react'
import {
  Form,
  Link
} from 'react-router-dom'
import { NoteData, Tag } from '../Types';

interface NoteFormProps{
  onSubmit: (data: NoteData) => void
}

export default function NoteForm({onSubmit}:NoteFormProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const markdownRef = useRef<HTMLTextAreaElement>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  
  function handleSubmit(evt:FormEvent){
    evt.preventDefault();
    
    onSubmit({
      title: titleRef.current!.value,
      markdown: markdownRef.current!.value,
      tags: []
    });
  }
  
  function handleTagsChange(evt:ChangeEvent<HTMLInputElement>){
    const tags = evt.target.value.replace(/ /g, '').split(',');
    const newTags = tags.map(tag => {
      return {
        id: tag,
        label: tag
      }
    })
    setSelectedTags(newTags);
  }
  
  return (<>
    <Form onSubmit={handleSubmit}>
      <div id="title">
        <label>Title</label>
        <input
          name='title'
          ref={titleRef}
        />
      </div>
      
      <div id="tags">
        <label>Tags</label>
        <input
          name='tags'
          onChange={handleTagsChange}
        />
      </div>
      
      <div id="markdown">
        <label>Body</label>
        <textarea
        name='markdown'
          ref={markdownRef}
          rows={15}
        ></textarea>
      </div>
      
      <button type="submit">Save</button>
      <Link to="...">
        <button type='button'>Cancel</button>
      </Link>
    </Form>
  </>)
}
