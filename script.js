let students = [];

let pendingDeleteId = null;

let deleteModal;


/* -------------------------------
   Page Load
-------------------------------- */

document.addEventListener("DOMContentLoaded", function () {

    deleteModal = new bootstrap.Modal(
        document.getElementById("deleteModal")
    );

    renderStudents();

    document
        .getElementById("studentForm")
        .addEventListener("submit", function (event) {

            event.preventDefault();

            addStudent();
        });

    document
        .getElementById("searchBtn")
        .addEventListener("click", searchStudent);

    document
        .getElementById("displayAllBtn")
        .addEventListener("click", displayAll);

    document
        .getElementById("confirmDeleteBtn")
        .addEventListener("click", confirmDelete);

});


/* -------------------------------
   Show Toast
-------------------------------- */

function showToast(message, type = "success") {

    const toastElement =
        document.getElementById("messageToast");

    const toastMessage =
        document.getElementById("toastMessage");

    const toastTitle =
        document.getElementById("toastTitle");

    toastMessage.textContent = message;

    if (type === "success") {

        toastTitle.textContent = "Success";

    } else {

        toastTitle.textContent = "Error";
    }

    const toast =
        new bootstrap.Toast(toastElement, {
            delay: 2500
        });

    toast.show();
}


/* -------------------------------
   Add Student
-------------------------------- */

function addStudent() {

    const studentId =
        document
            .getElementById("studentId")
            .value
            .trim();

    const studentName =
        document
            .getElementById("studentName")
            .value
            .trim();

    const studentCourse =
        document
            .getElementById("studentCourse")
            .value
            .trim();


    // Validation

    if (!studentId || !studentName || !studentCourse) {

        showToast(
            "Please fill all student details.",
            "error"
        );

        return;
    }


    // Check duplicate ID

    const duplicate =
        students.some(function (student) {

            return student.id.toLowerCase() ===
                   studentId.toLowerCase();

        });


    if (duplicate) {

        showToast(
            "Student ID already exists.",
            "error"
        );

        return;
    }


    // Create student object

    const student = {

        id: studentId,

        name: studentName,

        course: studentCourse

    };


    // Add to array

    students.push(student);


    // Update table

    renderStudents();


    // Clear form

    document
        .getElementById("studentForm")
        .reset();


    showToast(
        "Student added successfully."
    );
}


/* -------------------------------
   Render Students
-------------------------------- */

function renderStudents(list = students) {

    const tableBody =
        document.getElementById("studentTableBody");

    const totalStudents =
        document.getElementById("totalStudents");


    // Update total

    totalStudents.textContent =
        students.length;


    // Empty state

    if (list.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    class="empty-state"
                >

                    <div class="empty-state-icon">
                        📚
                    </div>

                    <p>
                        No student records found.
                    </p>

                </td>

            </tr>

        `;

        return;
    }


    // Generate rows

    tableBody.innerHTML = list
        .map(function (student) {

            return `

                <tr>

                    <td>
                        <span class="student-id">
                            ${escapeHtml(student.id)}
                        </span>
                    </td>

                    <td>
                        ${escapeHtml(student.name)}
                    </td>

                    <td>

                        <span class="course-badge">
                            ${escapeHtml(student.course)}
                        </span>

                    </td>

                    <td>

                        <button
                            class="delete-btn"
                            onclick="askDelete('${escapeAttribute(student.id)}')"
                        >
                            Delete
                        </button>

                    </td>

                </tr>

            `;

        })
        .join("");
}


/* -------------------------------
   Search Student
-------------------------------- */

function searchStudent() {

    const searchId =
        document
            .getElementById("searchId")
            .value
            .trim()
            .toLowerCase();


    if (!searchId) {

        showToast(
            "Please enter a Student ID.",
            "error"
        );

        return;
    }


    const result =
        students.filter(function (student) {

            return student.id.toLowerCase() ===
                   searchId;

        });


    if (result.length === 0) {

        renderStudents([]);

        showToast(
            "Student not found.",
            "error"
        );

        return;
    }


    renderStudents(result);

    showToast(
        "Student found successfully."
    );
}


/* -------------------------------
   Display All
-------------------------------- */

function displayAll() {

    document
        .getElementById("searchId")
        .value = "";

    renderStudents();

}


/* -------------------------------
   Ask Delete
-------------------------------- */

function askDelete(id) {

    pendingDeleteId = id;

    deleteModal.show();
}


/* -------------------------------
   Confirm Delete
-------------------------------- */

function confirmDelete() {

    if (!pendingDeleteId) {

        return;
    }


    students =
        students.filter(function (student) {

            return student.id !==
                   pendingDeleteId;

        });


    renderStudents();


    deleteModal.hide();


    showToast(
        "Student deleted successfully."
    );


    pendingDeleteId = null;
}


/* -------------------------------
   Escape HTML
-------------------------------- */

function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


/* -------------------------------
   Escape Attribute
-------------------------------- */

function escapeAttribute(value) {

    return value
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");
}