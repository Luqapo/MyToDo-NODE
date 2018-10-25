document.addEventListener('DOMContentLoaded', () => {

    const newTodo = document.querySelector('.new-todo');
    const getData = document.getElementById('getData');

    function getList() {
        const todoList = document.querySelector('.todo-list');
        todoList.innerHTML = '';
        fetch('http://localhost:3000/data')
        .then(resp => resp.json())
        .then(resp => makeList(resp))
    }
    
    newTodo.addEventListener('keyup', addNewTask);

    function addNewTask(){
        if (event.keyCode === 13) {
            if(newTodo.value.length > 0){
            const newText = newTodo.value;
            newTodo.value = '';

            fetch('/add', {
                method : 'POST',
                body : JSON.stringify({
                    text : newText,
                    completed : false,
                    id: null
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(r => r.json())
            .then(ans => {
                console.log('Odpowiedź z back-endu:', ans);
                getList();
            })
            }
            
        } 
    };

    function createLi(completed, text, id){
        const newLi = document.createElement('li');
        const newDiv = document.createElement('div');
        const newInput = document.createElement('input');
        const newLabel = document.createElement('label');
        const newButton = document.createElement('button');
        const newEditIn = document.createElement('input');

        const todoList = document.querySelector('.todo-list');
        
        newLi.dataset.id = id;
        newInput.setAttribute("type", "checkbox");
        newInput.className = 'toggle';
        newLabel.innerText = text;
        newButton.className = 'destroy';
        newEditIn.className = 'edit';

        if(completed){
            newLi.className = 'completed';
            newInput.checked = true;
        } else {
            newLi.className = '';
        }

        newButton.addEventListener('click', function(event){
            const dataId = event.target.parentElement.parentElement.dataset.id;
            fetch('/delete', {
                method : 'DELETE',
                body : JSON.stringify({
                    id: dataId
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(r => r.json())
            .then(ans => {
                console.log('Odpowiedź z back-endu:', ans);
                getList();
            })
        })

        newInput.addEventListener('change', function(event){
            if(event.target.checked){
                event.target.parentElement.parentElement.className = 'completed';
                const dataId = event.target.parentElement.parentElement.dataset.id;
                fetch('/completed', {
                    method : 'POST',
                    body : JSON.stringify({
                        completed: true,
                        id: dataId
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then(r => r.json())
                .then(ans => {
                    console.log('Odpowiedź z back-endu:', ans);
                    getList();
                })
            } else {
                event.target.parentElement.parentElement.className = '';
                const dataId = event.target.parentElement.parentElement.dataset.id;
                fetch('/completed', {
                    method : 'POST',
                    body : JSON.stringify({
                        completed: false,
                        id: dataId
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                .then(r => r.json())
                .then(ans => {
                    console.log('Odpowiedź z back-endu:', ans);
                    getList();
                })
            }
        })

        newDiv.appendChild(newInput);
        newDiv.appendChild(newLabel);
        newDiv.appendChild(newButton);
        newLi.appendChild(newDiv);
        newLi.appendChild(newEditIn);
        todoList.appendChild(newLi);


    }

    function makeList(data){
        data.forEach(element => {
            createLi(element.completed, element.text, element._id);
        });
    }

    getList();

})