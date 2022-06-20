import './App.css';
import React from 'react';

import { useState, useEffect } from 'react'
import {BsTrash, BsBookmarkCheck, BsBookmarkCheckFill} from 'react-icons/bs'

const API = "http://localhost:5000"

function App() {

  const [id, setId] = useState(0)
  const [title, setTitle] = useState("")
  const [time, setTime] = useState("")
  const [todos, setTodos] = useState([])
  const [loading, setLoding] = useState(false)

  useEffect(() => {
    const loadData = async() => {
      setLoding(true)

      const res = await fetch(API+ "/todos")
                        .then(response => response.json())
                        .then(data => data)
                        .catch(err => console.log(err))
      
      setLoding(false)
      setTodos(res)
    }

    loadData()
  }, [])

  const handleSubmit = async event => {
    event.preventDefault()
    const todo = {
      id: id,
      title: title,
      time: time,
      done: false,
    }

    await fetch(API+"/todos", {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      }
    })

    setTodos((prevState) => [...prevState, todo])

    await fetch(API+"/todos")
    .then((res) => res.json())
    .then( data => {
      const lastItem = data.length-1
      const lastId = data[lastItem].id
      setId((lastId+1))
    })
    .catch(err => console.log(err))
    setTitle("")
    setTime("")
  }

  const handleDelete = async (id) => {
    await fetch(API+"/todos/" + id, {
      method: "DELETE"
    })

    setTodos((prevState => prevState.filter((todo) => todo.id !== id)))
  }

  const handleEdit = async (task) => {

    task.done = !task.done

    const data = await fetch(API+"/todos/" + task.id, {
      method: "PUT",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
      }
    })

    setTodos((prevState => prevState.map(t => (
      t.id === data.id ? t = data : t
    ))))
  }

  if(loading) {
    return <p>Carregando...</p>
  }

  return (
    <div className="App">
      <div className='todo-header'>
        <h1>React To-Do</h1>
      </div>
      <div className='form-todo'>
        <h2>Insira sua próxima tarefa:</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-control'>
            <label htmlFor="title">Título</label>
            <input 
            type="text" 
            id="title" 
            placeholder='Digite o título da tarefa' 
            onChange={ e => setTitle(e.target.value)}
            value={title || ""}
            maxLength="60"
            required
            />
          </div>
          <div className="form-control">
            <label htmlFor="time">Duração</label>
            <input 
            type="number" 
            id="time" 
            placeholder='Tempo estimado em horas' 
            onChange={ e => setTime(e.target.value)}
            value={time || ""}
            min="1" 
            max="999"
            required
            />
          </div>

          <input type="submit" value="Criar tarefa" />
        </form>
      </div>
      <div className='list-todo'>
        <h2>Lista de tarefas:</h2>
        {todos.length === 0 && <p>Não há tarefas!</p>}
        <div className='list-items'>
          {todos.map(task => (
              <div className='todo-item' key={task.id}>
                <div className='todo-info'>
                  <h3 className={task.done ? "todo-done" : ""}>
                    {task.title}
                  </h3>
                  
                  <p>Duração: {task.time} horas</p>
                </div>
                <div className='actions'>
                  <span onClick={() => {handleEdit (task)}}>
                    {!task.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill className='book-check-fill'/>}
                  </span>
                  <BsTrash className="trash-icon" onClick={() => handleDelete(task.id)}/>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default App;
