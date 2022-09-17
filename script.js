const apiKey = 'b3b93904-8653-4c85-b4ad-62ed7b26fa00';
const apiHost = 'https://todo-api.coderslab.pl';

/* --------------------------------- SHOW TASKS --------------------------------- */
function apiListTasks() {
    return fetch(apiHost + '/api/tasks', {
        headers: {Authorization: apiKey}
    })
        .then(function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        })
}

// apiListTasks().then(function (response) {
//         console.log('Odpowiedź z serwera to:', response);
//     }
// );
//
// apiListTasks().then(function (response) {
//         console.log('Serwer zwrócił', response.data.length, 'zadań');
//         console.log('Tytuł pierwszego to', response.data[0].title);
//     }
// );

/* --------------------------------- ADD TASK ----------------------------------- */
function apiCreateTask(title, description) {
    return fetch(apiHost + '/api/tasks', {
        headers: {'Authorization': apiKey, 'Content-Type': 'application/json'},
        method: "POST",
        body: JSON.stringify({title: title, description: description, status: 'open'})
    })
        .then(function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        })
}

// apiCreateTask('Przykładowy tytuł', 'Przykładowy opis')
//     .then(function (response) {
//             console.log('Odpowiedź z serwera to:', response);
//         }
//     );

/* --------------------------------- DEL TASK ----------------------------------- */
function apiDeleteTask(taskId) {
    return fetch(apiHost + `/api/tasks/${taskId}`, {
        headers: {Authorization: apiKey},
        method: "DELETE"
    })
        .then(function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        })
}

/* --------------------------------- FINISH TASK -------------------------------- */
function apiUpdateTask(taskId, title, description, status) {
    return fetch(apiHost + `/api/tasks/${taskId}`, {
        headers: {Authorization: apiKey, 'Content-Type': 'application/json'},
        body: JSON.stringify({title: title, description: description, status: status}),
        method: "PUT"
    })
        .then(function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        })
}

/* --------------------------------- SHOW OPERATIONS ---------------------------- */
function apiListOperationsForTask(taskId) {
    return fetch(apiHost + `/api/tasks/${taskId}/operations`, {
        headers: {Authorization: apiKey}
    })
        .then(function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        })
}

/* --------------------------------- ADD OPERATION ------------------------------ */
function apiCreateOperationForTask(taskId, description) {
    return fetch(apiHost + `/api/tasks/${taskId}/operations`, {
        headers: {Authorization: apiKey, 'Content-Type': 'application/json'},
        body: JSON.stringify({description: description, timeSpent: 0}),
        method: "POST"
    })
        .then(function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        })
}

/* --------------------------------- UPDATE OPERATION --------------------------- */
function apiUpdateOperation(operationId, description, timeSpent) {
    return fetch(apiHost + `/api/operations/${operationId}`, {
        headers: {Authorization: apiKey, 'Content-Type': 'application/json'},
        body: JSON.stringify({description: description, timeSpent: timeSpent}),
        method: "PUT"
    })
        .then(function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        })
}

/* --------------------------------- DELETE OPERATION --------------------------- */
function apiDeleteOperation(operationId) {
    return fetch(apiHost + `/api/operations/${operationId}`, {
        headers: {Authorization: apiKey},
        method: "DELETE"
    })
        .then(function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        })
}

/* ============================== R E N D E R I N G ============================= */

/* --------------------------------- RENDER TASKS ------------------------------- */
function renderTask(taskId, title, description, status) {
    const section = document.createElement('section');
    section.className = 'card mt-5 shadow-sm';
    document.querySelector('main').appendChild(section);

    const headerDiv = document.createElement('div');
    headerDiv.className = 'card-header d-flex justify-content-between align-items-center';
    section.appendChild(headerDiv);

    const headerLeftDiv = document.createElement('div');
    headerDiv.appendChild(headerLeftDiv);

    const h5 = document.createElement('h5');
    h5.innerText = title;
    headerLeftDiv.appendChild(h5);

    const h6 = document.createElement('h6');
    h6.className = 'card-subtitle text-muted';
    h6.innerText = description;
    headerLeftDiv.appendChild(h6);

    const headerRightDiv = document.createElement('div');
    headerDiv.appendChild(headerRightDiv);

    if (status === 'open') {
        const finishButton = document.createElement('button');
        finishButton.className = 'btn btn-dark btn-sm js-task-open-only';
        finishButton.innerText = 'Finish';
        headerRightDiv.appendChild(finishButton);

        finishButton.addEventListener("click", function () {
            apiUpdateTask(taskId, title, description, "closed");
            const openTaskElements = section.querySelectorAll(".js-task-open-only");
            for (let element of openTaskElements) {
                element.parentElement.removeChild(element);
            }
        })
    }

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-outline-danger btn-sm ml-2';
    deleteButton.innerText = 'Delete';
    headerRightDiv.appendChild(deleteButton);

    deleteButton.addEventListener("click", function () {
        apiDeleteTask(taskId).then(function () {
            section.parentElement.removeChild(section);
        });
    });

    // lista operacji
    const ul = document.createElement('ul');
    ul.className = 'list-group list-group-flush';
    section.appendChild(ul);

    apiListOperationsForTask(taskId).then(function (response) {
        for (let operation of response.data) {
            renderOperation(ul, status, operation.id, operation.description, operation.timeSpent);
        }
    })

    // formularz dodawania nowej operacji
    if (status === 'open') {
        const addOperationDiv = document.createElement('div');
        addOperationDiv.className = 'card-body js-task-open-only';
        section.appendChild(addOperationDiv);

        const form = document.createElement('form');
        addOperationDiv.appendChild(form);

        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';
        form.appendChild(inputGroup);

        const descriptionInput = document.createElement('input');
        descriptionInput.setAttribute('type', 'text');
        descriptionInput.setAttribute('placeholder', 'Operation description');
        descriptionInput.setAttribute('minlength', '5');
        descriptionInput.className = 'form-control';
        inputGroup.appendChild(descriptionInput);

        const inputGroupAppend = document.createElement('div');
        inputGroupAppend.className = 'input-group-append';
        inputGroup.appendChild(inputGroupAppend);

        const addButton = document.createElement('button');
        addButton.className = 'btn btn-info';
        addButton.innerText = 'Add';
        inputGroupAppend.appendChild(addButton);

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            apiCreateOperationForTask(taskId, descriptionInput.value)
                .then(function (resp) {
                    renderOperation(ul, status, resp.data.id, resp.data.description, resp.data.timeSpent);
                })
        })

    }

}

/* --------------------------------- RENDER OPERATIONS -------------------------- */
function renderOperation(operationsList, status, operationId, operationDescription, timeSpent) {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';

    // operationsList to lista <ul>
    operationsList.appendChild(li);

    const descriptionDiv = document.createElement('div');
    descriptionDiv.innerText = operationDescription;
    li.appendChild(descriptionDiv);

    const time = document.createElement('span');
    time.className = 'badge badge-success badge-pill ml-2';
    time.innerText = formatTime(timeSpent);
    descriptionDiv.appendChild(time);

    if (status === "open") {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'js-task-open-only';
        li.appendChild(controlDiv);

        const add15minButton = document.createElement('button');
        add15minButton.className = 'btn btn-outline-success btn-sm mr-2';
        add15minButton.innerText = '+15m';
        controlDiv.appendChild(add15minButton);

        add15minButton.addEventListener("click", function () {
            apiUpdateOperation(operationId, operationDescription, (timeSpent + 15))
                .then(function (resp) {
                    time.innerText = formatTime(resp.data.timeSpent);
                    timeSpent = resp.data.timeSpent;
                });
        });

        const add1hButton = document.createElement('button');
        add1hButton.className = 'btn btn-outline-success btn-sm mr-2';
        add1hButton.innerText = '+1h';
        controlDiv.appendChild(add1hButton);

        add1hButton.addEventListener("click", function () {
            apiUpdateOperation(operationId, operationDescription, (timeSpent + 60))
                .then(function (resp) {
                    time.innerText = formatTime(resp.data.timeSpent);
                    timeSpent = resp.data.timeSpent;
                });
        });

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-outline-danger btn-sm';
        deleteButton.innerText = 'Delete';
        controlDiv.appendChild(deleteButton);

        deleteButton.addEventListener("click", function () {
            apiDeleteOperation(operationId)
                .then(function () {
                    li.parentElement.removeChild(li);
                });
        });

    }
}

/* ======================= E N D - O F - R E N D E R I N G ====================== */

/* --------------------------------- DOM BUILDING ------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
    apiListTasks().then(function (response) {
        for (let task of response.data) {
            renderTask(task.id, task.title, task.description, task.status);
        }
    });
    const addTaskForm = document.querySelector(".js-task-adding-form");
    addTaskForm.addEventListener("submit", function (event) {
        event.preventDefault();
        apiCreateTask(event.target.elements.title.value, event.target.elements.description.value)
            .then(function (resp) {
                renderTask(resp.data.id, resp.data.title, resp.data.description, resp.data.status)
            });
    });

});

/* --------------------------------- ADDITIONAL METHODS ------------------------- */

function formatTime(total) {
    const hours = Math.floor(total / 60);
    const minutes = total % 60;
    if (hours > 0) {
        return hours + 'h ' + minutes + 'm';
    } else {
        return minutes + 'm';
    }
}



