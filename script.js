// تهيئة البيانات من Local Storage أو إنشاء بيانات افتراضية
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// تحويل الساعة إلى نظام 12 ساعة إذا أمكن
function formatTimeTo12Hour(time) {
    const timeMatch = time.match(/(\d{1,2}):(\d{2})/);
    if (timeMatch) {
        const [_, hours, minutes] = timeMatch;
        let hour = parseInt(hours);
        const period = hour >= 12 ? 'مساءً' : 'صباحًا';
        hour = hour % 12 || 12;
        return time.replace(timeMatch[0], `${hour}:${minutes} ${period}`);
    }
    return time;
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

// الحصول على اسم اليوم بالعربية
function getDayName(date) {
    const options = { weekday: 'long' };
    return new Intl.DateTimeFormat('ar-SA', options).format(new Date(date));
}

// تجميع المهام حسب التاريخ
function groupTasksByDate(tasks) {
    const grouped = {};
    tasks.forEach(task => {
        const date = task.day;
        if (!grouped[date]) {
            grouped[date] = [];
        }
        grouped[date].push(task);
    });
    return grouped;
}

// عرض الجداول في الصفحة الأولى
function renderTable() {
    const content = document.getElementById('content');
    if (!content) return;
    content.innerHTML = ''; // تنظيف المحتوى

    // الجدول الأول: جميع المهام
    const groupedTasks = groupTasksByDate(tasks);
    Object.keys(groupedTasks).sort().forEach(date => {
        const tasksForDate = groupedTasks[date];
        const container = document.createElement('div');
        container.className = 'task-table-container';

        // إضافة العنوان
        const title = document.createElement('h3');
        title.className = 'task-table-title';
        title.textContent = `جدول المهام ليوم ${getDayName(date)} الموافق ${formatToHijri(date)}`;
        container.appendChild(title);

        // إنشاء الجدول
        const table = document.createElement('table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>اليوم والتاريخ</th>
                    <th>الساعة</th>
                    <th>نوع المهمة</th>
                    <th>موقع المهمة</th>
                    <th>المطلوب</th>
                    <th>المجموعة</th>
                    <th>إجراءات</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        const tbody = table.querySelector('tbody');
        tasksForDate.forEach((task, index) => {
            const globalIndex = tasks.indexOf(task);
            const row = document.createElement('tr');
            row.style.backgroundColor = task.color || '#ffffff';
            row.innerHTML = `
                <td>${getDayName(date)} ${formatToHijri(date)}</td>
                <td>${formatTimeTo12Hour(task.time)}</td>
                <td>${task.type}</td>
                <td>${task.location}</td>
                <td>${task.required}</td>
                <td>${task.group}</td>
                <td>
                    <button onclick="editTask(${globalIndex}, 'index.html')">تعديل</button>
                    <button onclick="deleteTask(${globalIndex})">حذف</button>
                    <input type="color" value="${task.color || '#ffffff'}" onchange="changeColor(${globalIndex}, this.value)">
                </td>
            `;
            tbody.appendChild(row);
        });
        container.appendChild(table);
        content.appendChild(container);
    });

    // إضافة التعليمات
    const instructionsContent = `
        <h2>ص/ ضباط خفر</h2>
        <h2>رقباء الرسايا</h2>
        <h2>ص/ للعمليات</h2>
        <div id="instructions">
            <p>السلام عليكم ورحمة الله وبركاته</p>
            <p>تجدون اعلاه بيان بالمهام الاسبوعيه المراد تغطيتها امنيا من قبلكم بالاضافة للمهام الطارئه</p>
            <p>لذا عليكم متابعة تغطيتها بالوقت المحدد دون اي ملاحظات مع التنيه على العموم بارتداء السلاح و التتجهيزات الميدانيه اللازمة لكل مهمة كالمتبع و التنسيق معنا بما يستجد أةل بأةل </p>
            <p class="ins">ملاحظات هامة جدا يجب الاطلاع عليها و التقيد بها حرفيا اثناء الاستلام:-</p>
            <ul>
                <li> حراسة البوابة الرسمية . </li>
                <li> مهام طارئة تصل بشكل مفاجئ يجب االستعداد لها. </li>
                <li> التقيد بالتوجيهات واالوامر والعمل بها وتنفيذها بكل دقة اثناء تأديتها . </li>
                <li> إعداد التقارير الالزمة لكل مهمة وتسليمها بعد االنتهاء منها مباشرة. </li>
                <li> التسلح والتجهيز المناسب ويكون حسب نوع المهمة. </li>
                <li> عند وجود أي مالحظة أثناء المهمة يجب إبالغ الضابط المستلم عن طريق غرفة العمليات أو االتصال المباشر بنا واخذ التوجيهات بهذا الشأن. </li>
                <li> أخذ الحيطة والحذر واالحتياطات األمنية الالزمة من قبل الجميع. </li>
                <li> يمنع الخروج أثناء االستلام ألي سبب وتكون المسئولية كاملة على الضابط المستلم </li>
                <li> أي مهمة رسمية خالل االستلام على الضابط المستلم مباشرتها وعلى مسؤوليته شخصيا.ً </li>
                <li> على الرقيب المستلم التعقيب على جميع المواقع المذكورة أعاله والتأكد على عدم وجود أي مالحظات في جميع المواقع والرفع لنا عن أي ش يء يستوجب الرفع في حينه. </li>
                <li> في حال طلب مندوب للمشاركة بأي لجنة من قبل اإلدارات الحكومية بالمنطقة يكلف العدد الكافي من االفراد والدوريات من قبل الضابط المستلم وتحت مسؤوليته شخصياً وإشعارنا عن المهمة في حينها . </li>
                <li> التقيد بالحضور بالوقت المحدد وعد االنصراف حتى أخذ التوجيه من العمليات </li>
                <li> عدم تشغيل السيفتي أثناء التوجه للموقع والمغادرة منه. </li>
            </ul>
        </div>
    `;
    content.insertAdjacentHTML('beforeend', instructionsContent);

    // الجدول الثاني: المهام المتغيرة
    const variableTasks = tasks.filter(task => !task.isFixed);
    if (variableTasks.length > 0) {
        const variableContainer = document.createElement('div');
        variableContainer.className = 'task-table-container';

        const variableTitle = document.createElement('h3');
        variableTitle.className = 'task-table-title';
        variableTitle.textContent = 'جدول المهام المتغيرة';
        variableContainer.appendChild(variableTitle);

        const variableTable = document.createElement('table');
        variableTable.innerHTML = `
            <thead>
                <tr>
                    <th>اليوم والتاريخ</th>
                    <th>الساعة</th>
                    <th>نوع المهمة</th>
                    <th>موقع المهمة</th>
                    <th>المطلوب</th>
                    <th>المجموعة</th>
                    <th>إجراءات</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        const variableTbody = variableTable.querySelector('tbody');
        variableTasks.forEach((task, index) => {
            const globalIndex = tasks.indexOf(task);
            const row = document.createElement('tr');
            row.style.backgroundColor = task.color || '#ffffff';
            row.innerHTML = `
                <td>${getDayName(task.day)} ${formatToHijri(task.day)}</td>
                <td>${formatTimeTo12Hour(task.time)}</td>
                <td>${task.type}</td>
                <td>${task.location}</td>
                <td>${task.required}</td>
                <td>${task.group}</td>
                <td>
                    <button onclick="editTask(${globalIndex}, 'index.html')">تعديل</button>
                    <button onclick="deleteTask(${globalIndex})">حذف</button>
                    <input type="color" value="${task.color || '#ffffff'}" onchange="changeColor(${globalIndex}, this.value)">
                </td>
            `;
            variableTbody.appendChild(row);
        });
        variableContainer.appendChild(variableTable);
        content.appendChild(variableContainer);
    }

    // إضافة النصوص الختامية محاذاة إلى اليمين
    const closingContent = `
        <h2 class="right-align">قائد قوة المهمات الخاصة</h2>
        <h2 class="right-align">عقيد /</h2>
        <h2 class="right-align">فيصل بن خالد النفيسة</h2>
    `;
    content.insertAdjacentHTML('beforeend', closingContent);

    saveToLocalStorage();
}

// عرض المهام المتغيرة في جدول بالصفحة المنفصلة مع الإجراءات
function renderVariableTasks() {
    const tbody = document.getElementById('variableTaskTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    const variableTasks = tasks.filter(task => !task.isFixed);
    if (variableTasks.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="7">لا توجد مهام متغيرة حاليًا</td>';
        tbody.appendChild(row);
    } else {
        variableTasks.forEach((task, index) => {
            const globalIndex = tasks.indexOf(task);
            const row = document.createElement('tr');
            row.style.backgroundColor = task.color || '#ffffff';
            row.innerHTML = `
                <td>${getDayName(task.day)} ${formatToHijri(task.day)}</td>
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
        color: '#ffffff'
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
        localStorage.removeItem('editIndex');
    }
}

// حذف مهمة
function deleteTask(index) {
    tasks.splice(index, 1);
    renderTable();
    renderVariableTasks();
    saveToLocalStorage();
}

// تغيير لون الصف
function changeColor(index, color) {
    tasks[index].color = color;
    renderTable();
    renderVariableTasks();
    saveToLocalStorage();
}

// حفظ البيانات في Local Storage
function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// إرسال الصفحة كـ PDF إلى WhatsApp بدون الـ inputs والـ buttons
function sendToManager() {
    if (!window.jspdf || !window.html2canvas) {
        alert('يرجى التأكد من تحميل مكتبات jsPDF و html2canvas. تأكد من اتصالك بالإنترنت.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const pdfContent = document.getElementById('pdfContent');
    if (!pdfContent) {
        alert('خطأ: عنصر #pdfContent غير موجود.');
        return;
    }
    pdfContent.innerHTML = ''; // تنظيف المحتوى المؤقت

    // إضافة القائمة العلوية
    const topList = document.querySelector('body > ul');
    if (topList) pdfContent.appendChild(topList.cloneNode(true));

    // إضافة العنوان الرئيسي مع الكلاس main-title
    const mainTitle = document.querySelector('body > h2.main-title');
    if (mainTitle) {
        const clonedTitle = mainTitle.cloneNode(true);
        clonedTitle.className = 'main-title';
        pdfContent.appendChild(clonedTitle);
    }

    // الجدول الأول: جميع المهام
    const groupedTasks = groupTasksByDate(tasks);
    Object.keys(groupedTasks).sort().forEach(date => {
        const tasksForDate = groupedTasks[date];
        const container = document.createElement('div');
        container.className = 'task-table-container';

        const title = document.createElement('h3');
        title.className = 'task-table-title';
        title.textContent = `جدول المهام ليوم ${getDayName(date)} الموافق ${formatToHijri(date)}`;
        container.appendChild(title);

        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>اليوم والتاريخ</th>
                    <th>الساعة</th>
                    <th>نوع المهمة</th>
                    <th>موقع المهمة</th>
                    <th>المطلوب</th>
                    <th>المجموعة</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        const tbody = table.querySelector('tbody');
        tasksForDate.forEach(task => {
            const row = document.createElement('tr');
            row.style.backgroundColor = task.color || '#ffffff';
            row.innerHTML = `
                <td>${getDayName(date)} ${formatToHijri(date)}</td>
                <td>${formatTimeTo12Hour(task.time)}</td>
                <td>${task.type}</td>
                <td>${task.location}</td>
                <td>${task.required}</td>
                <td>${task.group}</td>
            `;
            tbody.appendChild(row);
        });
        container.appendChild(table);
        pdfContent.appendChild(container);
    });

    // إضافة التعليمات
    const instructionsContent = `
        <h2>ص/ ضباط خفر</h2>
        <h2>رقباء الرسايا</h2>
        <h2>ص/ للعمليات</h2>
        <div id="instructions">
            <p>السلام عليكم ورحمة الله وبركاته</p>
            <p>تجدون اعلاه بيان بالمهام الاسبوعيه المراد تغطيتها امنيا من قبلكم بالاضافة للمهام الطارئه</p>
            <p>لذا عليكم متابعة تغطيتها بالوقت المحدد دون اي ملاحظات مع التنيه على العموم بارتداء السلاح و التتجهيزات الميدانيه اللازمة لكل مهمة كالمتبع و التنسيق معنا بما يستجد أةل بأةل </p>
            <p class="ins">ملاحظات هامة جدا يجب الاطلاع عليها و التقيد بها حرفيا اثناء الاستلام:-</p>
            <ul>
                <li> حراسة البوابة الرسمية . </li>
                <li> مهام طارئة تصل بشكل مفاجئ يجب االستعداد لها. </li>
                <li> التقيد بالتوجيهات واالوامر والعمل بها وتنفيذها بكل دقة اثناء تأديتها . </li>
                <li> إعداد التقارير الالزمة لكل مهمة وتسليمها بعد االنتهاء منها مباشرة. </li>
                <li> التسلح والتجهيز المناسب ويكون حسب نوع المهمة. </li>
                <li> عند وجود أي مالحظة أثناء المهمة يجب إبالغ الضابط المستلم عن طريق غرفة العمليات أو االتصال المباشر بنا واخذ التوجيهات بهذا الشأن. </li>
                <li> أخذ الحيطة والحذر واالحتياطات األمنية الالزمة من قبل الجميع. </li>
                <li> يمنع الخروج أثناء االستلام ألي سبب وتكون المسئولية كاملة على الضابط المستلم </li>
                <li> أي مهمة رسمية خالل االستلام على الضابط المستلم مباشرتها وعلى مسؤوليته شخصيا.ً </li>
                <li> على الرقيب المستلم التعقيب على جميع المواقع المذكورة أعاله والتأكد على عدم وجود أي مالحظات في جميع المواقع والرفع لنا عن أي ش يء يستوجب الرفع في حينه. </li>
                <li> في حال طلب مندوب للمشاركة بأي لجنة من قبل اإلدارات الحكومية بالمنطقة يكلف العدد الكافي من االفراد والدوريات من قبل الضابط المستلم وتحت مسؤوليته شخصياً وإشعارنا عن المهمة في حينها . </li>
                <li> التقيد بالحضور بالوقت المحدد وعد االنصراف حتى أخذ التوجيه من العمليات </li>
                <li> عدم تشغيل السيفتي أثناء التوجه للموقع والمغادرة منه. </li>
            </ul>
        </div>
    `;
    pdfContent.insertAdjacentHTML('beforeend', instructionsContent);

    // الجدول الثاني: المهام المتغيرة
    const variableTasks = tasks.filter(task => !task.isFixed);
    if (variableTasks.length > 0) {
        const variableContainer = document.createElement('div');
        variableContainer.className = 'task-table-container';

        const variableTitle = document.createElement('h3');
        variableTitle.className = 'task-table-title';
        variableTitle.textContent = 'جدول المهام المتغيرة';
        variableContainer.appendChild(variableTitle);

        const variableTable = document.createElement('table');
        variableTable.style.width = '100%';
        variableTable.style.borderCollapse = 'collapse';
        variableTable.innerHTML = `
            <thead>
                <tr>
                    <th>اليوم والتاريخ</th>
                    <th>الساعة</th>
                    <th>نوع المهمة</th>
                    <th>موقع المهمة</th>
                    <th>المطلوب</th>
                    <th>المجموعة</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        const variableTbody = variableTable.querySelector('tbody');
        variableTasks.forEach(task => {
            const row = document.createElement('tr');
            row.style.backgroundColor = task.color || '#ffffff';
            row.innerHTML = `
                <td>${getDayName(task.day)} ${formatToHijri(task.day)}</td>
                <td>${formatTimeTo12Hour(task.time)}</td>
                <td>${task.type}</td>
                <td>${task.location}</td>
                <td>${task.required}</td>
                <td>${task.group}</td>
            `;
            variableTbody.appendChild(row);
        });
        variableContainer.appendChild(variableTable);
        pdfContent.appendChild(variableContainer);
    }

    // إضافة النصوص الختامية محاذاة إلى اليمين
    const closingContent = `
        <h2 class="right-align">قائد قوة المهمات الخاصة</h2>
        <h2 class="right-align">عقيد /</h2>
        <h2 class="right-align">فيصل بن خالد النفيسة</h2>
    `;
    pdfContent.insertAdjacentHTML('beforeend', closingContent);

    // الانتظار قليلاً لضمان تحميل المحتوى قبل التقاطه
    setTimeout(() => {
        html2canvas(pdfContent, {
            scale: 2,
            width: pdfContent.scrollWidth || 800,
            height: pdfContent.scrollHeight || 1000,
            logging: true
        }).then((canvas) => {
            console.log('Canvas Width:', canvas.width, 'Canvas Height:', canvas.height);
            if (!canvas || canvas.width === 0 || canvas.height === 0) {
                throw new Error('الـ Canvas فارغ أو غير صالح.');
            }

            const imgData = canvas.toDataURL('image/png', 0.9);
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pageWidth = 210;
            const pageHeight = 297;
            const margin = 10;
            const imgWidth = pageWidth - 2 * margin;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            let position = margin;

            if (!imgData || imgData.length < 100) {
                throw new Error('بيانات الصورة غير صالحة أو فارغة.');
            }

            pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
            heightLeft -= (pageHeight - 2 * margin);

            while (heightLeft > 0) {
                pdf.addPage();
                position = heightLeft - imgHeight + margin;
                pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
                heightLeft -= (pageHeight - 2 * margin);
            }

            const pdfBlob = pdf.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);
            const message = `جدول المهام اليومية: يرجى تحميل ملف PDF من الرابط التالي\n${pdfUrl}`;
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');

            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = 'جدول_المهام.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }).catch((error) => {
            console.error('خطأ أثناء إنشاء PDF:', error);
            alert('حدث خطأ أثناء إنشاء ملف PDF: ' + error.message);
        });
    }, 500); // تأخير 500 مللي ثانية لضمان تحميل المحتوى
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

    const content = document.getElementById('content');
    content.innerHTML = '';
    const groupedTasks = groupTasksByDate(filteredTasks);
    Object.keys(groupedTasks).sort().forEach(date => {
        const tasksForDate = groupedTasks[date];
        const container = document.createElement('div');
        container.className = 'task-table-container';

        const title = document.createElement('h3');
        title.className = 'task-table-title';
        title.textContent = `جدول المهام ليوم ${getDayName(date)} الموافق ${formatToHijri(date)}`;
        container.appendChild(title);

        const table = document.createElement('table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>اليوم والتاريخ</th>
                    <th>الساعة</th>
                    <th>نوع المهمة</th>
                    <th>موقع المهمة</th>
                    <th>المطلوب</th>
                    <th>المجموعة</th>
                    <th>إجراءات</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;
        const tbody = table.querySelector('tbody');
        tasksForDate.forEach((task, index) => {
            const globalIndex = tasks.indexOf(task);
            const row = document.createElement('tr');
            row.style.backgroundColor = task.color || '#ffffff';
            row.innerHTML = `
                <td>${getDayName(date)} ${formatToHijri(date)}</td>
                <td>${formatTimeTo12Hour(task.time)}</td>
                <td>${task.type}</td>
                <td>${task.location}</td>
                <td>${task.required}</td>
                <td>${task.group}</td>
                <td>
                    <button onclick="editTask(${globalIndex}, 'index.html')">تعديل</button>
                    <button onclick="deleteTask(${globalIndex})">حذف</button>
                    <input type="color" value="${task.color || '#ffffff'}" onchange="changeColor(${globalIndex}, this.value)">
                </td>
            `;
            tbody.appendChild(row);
        });
        container.appendChild(table);
        content.appendChild(container);
    });
}

// تحميل البيانات حسب الصفحة
window.onload = function() {
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    renderTable();
    renderVariableTasks();
    loadEditTask();
};