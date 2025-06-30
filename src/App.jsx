import { useState, useEffect } from "react"

function App(){
	const [tasks, setTasks] = useState(()=>{
		try{
			const savedTudo = localStorage.getItem('tasks');
			return savedTudo ? JSON.parse(savedTudo) : [];
		}catch(error){
			console.error(error);
		}
	});

	useEffect(()=>{
		try{
			localStorage.setItem('tasks', JSON.stringify(tasks));
		}catch(error){
			console.log(error);
		}
	}, [tasks])

    const [task, setTask] = useState('');
    const [editId, setEditId] = useState(null);
    const [editText, setEditText] = useState('');
	const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);


    //add task
    const handleTask = (e) =>{
        e.preventDefault();
        const trimmedTask = task.trim('');
		if(trimmedTask){
			const taskExist = tasks.some(t => t.text.toLowerCase() === trimmedTask.toLowerCase());
			if(taskExist){
				setShowDuplicateWarning(true);
				setTimeout(() => {
					setShowDuplicateWarning(false)
				}, 1500);
				return
			}
			const newTask = {
                id: Date.now(),
                text: task,
                completed: false
            };
            setTasks([...tasks, newTask]);
            setTask('');
			setShowDuplicateWarning(false)
		}
    }

    //add task using enter key
    const handleKeyDown = (e)=>{
        if(e.key === 'Enter'){
            handleTask(e);
        }
    }

    //mark for completed tasks
    const handleComplete = (id) =>{
        setTasks(tasks.map(value => value.id === id ? {...value, completed: !value.completed} : value));
    }


    //delete task
    const deleteTask = (id) =>{
        setTasks(tasks.filter(value => value.id !== id));
    }

    //edit task
    const editTask = (task) =>{
        setEditId(task.id);
        setEditText(task.text);
    }

	//save task
	const saveEdit = (id) => {
		const trimmedEditText = editText.trim();
		if(trimmedEditText) {
			const taskExists = tasks.some(t => t.text.toLowerCase() === trimmedEditText.toLowerCase());
			
			if(taskExists) {
				setShowDuplicateWarning(true);
				setTimeout(() => {
					setShowDuplicateWarning(false);
				}, 1500);
				return; 
			}
			
			setTasks(tasks.map(value => value.id === id ? {...value, text: trimmedEditText} : value));
			setEditId(null);
			setShowDuplicateWarning(false);
		}
	}

	//cancel task
    const cancelEdit = () =>{
        setEditId(null);
    }

	//pending and completed tasks
    const pendingTask = tasks.filter(value => !value.completed);
    const completedTask = tasks.filter(value => value.completed);

    return (
        <div className="container-fluid py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-6">
                    <div className="card shadow">
                        <div className="card-body">
                            <h1 className="card-title text-center text-primary mb-4">ToDo App</h1>
							{/* duplicate task warining */}
                            {showDuplicateWarning && (
								<div className="alert alert-warning d-flex align-items-center mb-3" role="alert">
									<i className="bi bi-exclamation-triangle-fill me-2"></i>
									<div>This task already exists!</div>
								</div>
							)}
                            {/* Pending Tasks */}
                            <div className="pending-tasks mb-4">
                                {pendingTask.length === 0 ? (
                                    <div className="alert alert-info p-2 mb-0">No tasks yet. Add one below!</div>
                                ) : (
                                    pendingTask.map(val => (
                                        <div key={val.id} className="alert alert-primary p-2 d-flex align-items-center gap-2 mb-2">
                                            {editId === val.id ? (
                                                <div className="d-flex w-100 gap-2">
													{/* editing a task */}
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={editText}
                                                        onChange={(e) => setEditText(e.target.value)}
                                                    />
                                                    <button
                                                        className="btn btn-success flex-shrink-0"
                                                        style={{ width: "80px" }}
                                                        onClick={() => saveEdit(val.id)}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        className="btn btn-secondary flex-shrink-0"
                                                        style={{ width: "80px" }}
                                                        onClick={cancelEdit}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
													{/* pending task filed */}
                                                    <div className="form-check d-flex align-items-center flex-grow-1 overflow-hidden">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input me-2 flex-shrink-0"
                                                            onChange={() => handleComplete(val.id)}
                                                            checked={val.completed}
                                                            id={val.id}
                                                        />
                                                        <label
                                                            className="form-check-label text-truncate mb-0"
                                                            htmlFor={val.id}
                                                            style={{ maxWidth: "100%" }}
                                                        >
                                                            {val.text}
                                                        </label>
                                                    </div>

													{/* editing and delete options */}
                                                    <div className="d-flex flex-shrink-0 gap-1">
                                                        <button
                                                            className="btn btn-sm btn-outline-primary"
                                                            style={{ width: "32px" }}
                                                            onClick={() => editTask(val)}
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            style={{ width: "32px" }}
                                                            onClick={() => deleteTask(val.id)}
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Add Task Input and button*/}
                            <div className="input-group mb-3">
                                <input
                                    value={task}
                                    onChange={(e) => setTask(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    type="text"
                                    className="form-control"
                                    placeholder="Add a new task"
                                />
                                <button className="btn btn-outline-primary" type="button" onClick={handleTask}>
                                    Add
                                </button>
                            </div>

                            {/* Completed Tasks */}
                            <div className="completed-tasks mt-4">
                                <h6 className="text-primary mb-3">Completed Tasks</h6>
                                {completedTask.map(val => (
                                    <div key={val.id} className="alert alert-success p-2 d-flex align-items-center mb-2">
                                        <span className="text-truncate flex-grow-1">{val.text}</span>
                                        <button
                                            className="btn btn-sm btn-outline-danger flex-shrink-0"
                                            style={{ width: "32px" }}
                                            onClick={() => deleteTask(val.id)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Status */}
                            <div className="mt-4 pt-3 border-top">
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Total: <strong>{tasks.length}</strong></span>
                                    <span className="text-primary">Pending: <strong>{pendingTask.length}</strong></span>
                                    <span className="text-success">Completed: <strong>{completedTask.length}</strong></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default App