// تهيئة البيانات من Local Storage أو إنشاء بيانات افتراضية
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// تحويل الساعة إلى نظام 12 ساعة
function formatTimeTo12Hour(time) {
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours);
    const period = hour >= 12 ? 'مساءً' : 'صباحًا';
    hour = hour % 12 || 12;
    return `${hour}:${minutes} ${period}`;
}

// تحويل التاريخ إلى التقويم الهجري
function formatToHijri(date) {
    const options = { 
        calendar: 'islamic-umalqura', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    };
    return new Intl.DateTimeFormat('ar-SA', options).format(new Date(date));
}

// عرض الجدول في الصفحة الأولى
function renderTable() {
    const tbody = document.getElementById('taskTableBody');
    if (!tbody) return; // للتأكد من أننا في الصفحة الصحيحة
    tbody.innerHTML = '';
    tasks.forEach((task, index) => {
        const row = document.createElement('tr');
        row.style.backgroundColor = task.color || '#ffffff'; // تطبيق اللون
        row.innerHTML = `
            <td>${formatToHijri(task.day)}</td>
            <td>${formatTimeTo12Hour(task.time)}</td>
            <td>${task.type}</td>
            <td>${task.location}</td>
            <td>${task.required}</td>
            <td>${task.group}</td>
            <td>
                <button onclick="editTask(${index}, 'index.html')">تعديل</button>
                <button onclick="deleteTask(${index})">حذف</button>
                <input type="color" value="${task.color || '#ffffff'}" onchange="changeColor(${index}, this.value)">
            </td>
        `;
        tbody.appendChild(row);
    });
    saveToLocalStorage();
}

// عرض المهام المتغيرة في جدول بالصفحة المنفصلة مع الإجراءات
function renderVariableTasks() {
    const tbody = document.getElementById('variableTaskTableBody');
    if (!tbody) return; // للتأكد من أننا في الصفحة الصحيحة
    tbody.innerHTML = '';
    const variableTasks = tasks.filter(task => !task.isFixed);
    if (variableTasks.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="7">لا توجد مهام متغيرة حاليًا</td>';
        tbody.appendChild(row);
    } else {
        variableTasks.forEach((task, index) => {
            const globalIndex = tasks.indexOf(task); // الحصول على الفهرس العام في قائمة tasks
            const row = document.createElement('tr');
            row.style.backgroundColor = task.color || '#ffffff'; // تطبيق اللون المحفوظ
            row.innerHTML = `
                <td>${formatToHijri(task.day)}</td>
                <td>${formatTimeTo12Hour(task.time)}</td>
                <td>${task.type}</td>
                <td>${task.location}</td>
                <td>${task.required}</td>
                <td>${task.group}</td>
                <td>
                    <button onclick="editTask(${globalIndex}, 'variable_tasks.html')">تعديل</button>
                    <button onclick="deleteTask(${globalIndex})">حذف</button>
                    <input type="color" value="${task.color || '#ffffff'}" onchange="changeColor(${globalIndex}, this.value)">
                </td>
            `;
            tbody.appendChild(row);
        });
    }
}

// إضافة مهمة جديدة
document.getElementById('taskForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const task = {
        day: document.getElementById('day').value,
        time: document.getElementById('time').value,
        type: document.getElementById('type').value,
        location: document.getElementById('location').value,
        required: document.getElementById('required').value,
        group: document.getElementById('group').value,
        isFixed: document.getElementById('isFixed').checked,
        color: '#ffffff' // اللون الافتراضي
    };
    tasks.push(task);
    renderTable();
    this.reset();
});

// تعديل مهمة
function editTask(index, page) {
    const task = tasks[index];
    if (page === 'index.html' && document.getElementById('taskForm')) {
        document.getElementById('day').value = task.day;
        document.getElementById('time').value = task.time;
        document.getElementById('type').value = task.type;
        document.getElementById('location').value = task.location;
        document.getElementById('required').value = task.required;
        document.getElementById('group').value = task.group;
        document.getElementById('isFixed').checked = task.isFixed;
        tasks.splice(index, 1);
        renderTable();
    } else {
        // إذا كنا في صفحة المهام المتغيرة، الانتقال إلى الصفحة الرئيسية مع تمرير الفهرس
        localStorage.setItem('editIndex', index);
        window.location.href = 'index.html';
    }
}

// تحميل بيانات التعديل عند فتح الصفحة الرئيسية
function loadEditTask() {
    const editIndex = localStorage.getItem('editIndex');
    if (editIndex !== null && document.getElementById('taskForm')) {
        const task = tasks[editIndex];
        document.getElementById('day').value = task.day;
        document.getElementById('time').value = task.time;
        document.getElementById('type').value = task.type;
        document.getElementById('location').value = task.location;
        document.getElementById('required').value = task.required;
        document.getElementById('group').value = task.group;
        document.getElementById('isFixed').checked = task.isFixed;
        tasks.splice(editIndex, 1);
        renderTable();
        localStorage.removeItem('editIndex'); // إزالة الفهرس بعد التحميل
    }
}

// حذف مهمة
function deleteTask(index) {
    tasks.splice(index, 1);
    renderTable();
    renderVariableTasks();
    saveToLocalStorage(); // التأكد من حفظ التغييرات
}

// تغيير لون الصف
function changeColor(index, color) {
    tasks[index].color = color;
    renderTable();
    renderVariableTasks();
    saveToLocalStorage(); // التأكد من حفظ اللون الجديد
}

// حفظ البيانات في Local Storage
function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// إرسال إلى المدير عبر WhatsApp
function sendToManager() {
    const message = `جدول المهام:\n${tasks.map(t => `${formatToHijri(t.day)} - ${formatTimeTo12Hour(t.time)} - ${t.type} - ${t.location} - ${t.required} - ${t.group}`).join('\n')}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// طباعة الجدول
function printTable() {
    window.print();
}

// فلتر المهام لمدة 3 أشهر
function filterTasks() {
    const filterDate = new Date(document.getElementById('filterDate').value);
    const threeMonthsLater = new Date(filterDate);
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

    const filteredTasks = tasks.filter(task => {
        const taskDate = new Date(task.day);
        return taskDate >= filterDate && taskDate <= threeMonthsLater;
    });

    const tbody = document.getElementById('taskTableBody');
    tbody.innerHTML = '';
    filteredTasks.forEach((task, index) => {
        const row = document.createElement('tr');
        row.style.backgroundColor = task.color || '#ffffff'; // تطبيق اللون
        row.innerHTML = `
            <td>${formatToHijri(task.day)}</td>
            <td>${formatTimeTo12Hour(task.time)}</td>
            <td>${task.type}</td>
            <td>${task.location}</td>
            <td>${task.required}</td>
            <td>${task.group}</td>
            <td>
                <button onclick="editTask(${index}, 'index.html')">تعديل</button>
                <button onclick="deleteTask(${index})">حذف</button>
                <input type="color" value="${task.color || '#ffffff'}" onchange="changeColor(${index}, this.value)">
            </td>
        `;
        tbody.appendChild(row);
    });
}

// تحميل البيانات حسب الصفحة
window.onload = function() {
    // تحديث البيانات من Local Storage عند تحميل أي صفحة
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    // استدعاء الدالة المناسبة بناءً على الصفحة
    renderTable(); // للصفحة الرئيسية
    renderVariableTasks(); // لصفحة المهام المتغيرة
    loadEditTask(); // تحميل بيانات التعديل إذا وجدت
};