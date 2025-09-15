const taskForm = document.getElementById('taskForm');
const pendingTasksEl = document.getElementById('pendingTasks');
const completedTasksEl = document.getElementById('completedTasks');

let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

// utilities
function el(tag, cls) { const e = document.createElement(tag); if (cls) e.className = cls; return e; }
function fmt(dt) { return new Date(dt).toLocaleString(); }
function saveTasks() { localStorage.setItem('tasks', JSON.stringify(tasks)); render(); }

// Pending live update
function updatePendingLive(el, addedAt) {
    const diff = Math.max(0, Math.floor((new Date() - new Date(addedAt)) / (1000 * 60))); // minutes
    el.textContent = diff + ' min ago';
}

// Task item with inline edit
function taskListItem(task) {
    const li = el('li', 'task-item');
    if (task.completedAt) li.classList.add('completed');
    li.dataset.id = task.id;

    const left = el('div', 'left');
    const badge = el('div', 'badge ' + task.priority); badge.textContent = task.priority.toUpperCase();
    const body = el('div', 'task-body');

    const titleDiv = el('div', 'task-title'); titleDiv.textContent = task.title;
    const purposeDiv = el('div', 'task-purpose'); purposeDiv.textContent = task.purpose || '';
    const metaDiv = el('div', 'task-meta');

    if (task.completedAt) {
        metaDiv.textContent = `Added: ${fmt(task.addedAt)} • Completed: ${fmt(task.completedAt)}`;
    } else metaDiv.textContent = `Added: ${fmt(task.addedAt)} • Schedule: ${task.schedule ? fmt(task.schedule) : 'Not scheduled'}`;

    body.append(titleDiv); if (purposeDiv.textContent) body.append(purposeDiv); body.append(metaDiv);
    left.append(badge, body);

    const btns = el('div', 'btns');
    if (!task.completedAt) {
        const pl = el('div', 'pending-live');
        updatePendingLive(pl, task.addedAt);
        btns.appendChild(pl);
    }

    const editBtn = el('button', 'icon-btn edit'); editBtn.textContent = 'Edit';
    const completeBtn = el('button', 'icon-btn complete'); completeBtn.textContent = task.completedAt ? 'Undo' : 'Done';
    const deleteBtn = el('button', 'icon-btn delete'); deleteBtn.textContent = 'Del';

    btns.append(editBtn, completeBtn, deleteBtn);
    li.append(left, btns);
    li.style.animation = 'fadeInUp .28s ease both';

    // EDIT INLINE
    editBtn.onclick = () => {
        const editContainer = el('div', 'edit-inline');
        editContainer.style.display = 'flex';
        editContainer.style.flexDirection = 'column';
        editContainer.style.gap = '6px';
        editContainer.style.marginTop = '8px';
        // inputs
        const titleInput = el('input'); titleInput.value = task.title; titleInput.style.padding = '6px'; titleInput.style.borderRadius = '8px';
        const purposeInput = el('textarea'); purposeInput.value = task.purpose; purposeInput.style.padding = '6px'; purposeInput.style.borderRadius = '8px'; purposeInput.style.resize = 'none';
        const prioritySelect = el('select');['high', 'medium', 'low'].forEach(p => {
            const op = el('option'); op.value = p; op.textContent = p.toUpperCase(); if (task.priority === p) op.selected = true;
            prioritySelect.appendChild(op);
        });
        prioritySelect.style.padding = '6px'; prioritySelect.style.borderRadius = '8px';
        const actionDiv = el('div'); actionDiv.style.display = 'flex'; actionDiv.style.gap = '6px';
        const saveBtn = el('button', 'icon-btn complete'); saveBtn.textContent = 'Save';
        const cancelBtn = el('button', 'icon-btn delete'); cancelBtn.textContent = 'Cancel';
        actionDiv.append(saveBtn, cancelBtn);
        editContainer.append(titleInput, purposeInput, prioritySelect, actionDiv);

        body.innerHTML = ''; // clear old
        body.append(editContainer);

        // SAVE
        saveBtn.onclick = () => {
            task.title = titleInput.value.trim() || task.title;
            task.purpose = purposeInput.value.trim();
            task.priority = prioritySelect.value;
            saveTasks();
        }
        // CANCEL
        cancelBtn.onclick = () => saveTasks();
    }

    // COMPLETE / UNDO
    completeBtn.onclick = () => task.completedAt ? undoComplete(task.id) : markComplete(task.id);

    // DELETE
    deleteBtn.onclick = () => removeTask(task.id);

    return li;
}

// RENDER
function render() {
    pendingTasksEl.innerHTML = ''; completedTasksEl.innerHTML = '';
    tasks.forEach(t => {
        const li = taskListItem(t);
        t.completedAt ? completedTasksEl.appendChild(li) : pendingTasksEl.appendChild(li);
    });
}

// ADD
taskForm.addEventListener('submit', e => {
    e.preventDefault();
    const t = { id: Date.now(), title: taskForm.taskTitle.value, priority: taskForm.priority.value, purpose: taskForm.purpose.value, addedAt: new Date().toISOString(), completedAt: null, schedule: taskForm.dueDate.value || null };
    tasks.push(t); saveTasks(); taskForm.reset();
});

// complete / undo
function markComplete(id) { const t = tasks.find(x => x.id === id); if (!t) return; t.completedAt = new Date().toISOString(); saveTasks(); }
function undoComplete(id) { const t = tasks.find(x => x.id === id); if (!t) return; t.completedAt = null; saveTasks(); }

// remove
function removeTask(id) { tasks = tasks.filter(x => x.id !== id); saveTasks(); }

// footer year
document.getElementById('year').textContent = new Date().getFullYear();

render();