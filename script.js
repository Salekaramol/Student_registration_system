document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements - Student System
    const form = document.getElementById('registration-form');
    const tableBody = document.querySelector('#students-table tbody');
    const noRecords = document.getElementById('no-records');
    const countElement = document.getElementById('count');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const tableContainer = document.querySelector('.table-container');
    
    // DOM Elements - Modals
    const privacyModal = document.getElementById('privacy-modal');
    const termsModal = document.getElementById('terms-modal');
    const contactModal = document.getElementById('contact-modal');
    const privacyLink = document.getElementById('privacy-link');
    const termsLink = document.getElementById('terms-link');
    const contactLink = document.getElementById('contact-link');
    const closeButtons = document.querySelectorAll('.close-modal');
    const contactForm = document.getElementById('contact-form');
    const closeContactBtn = document.querySelector('.close-contact');

    // Initialize students array from localStorage or empty array
    let students = JSON.parse(localStorage.getItem('students')) || [];
    let editIndex = null;

    /* ====================== */
    /* STUDENT SYSTEM FUNCTIONS */
    /* ====================== */

    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const studentId = document.getElementById('student-id').value.trim();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const contact = document.getElementById('contact').value.trim();
        const studentClass = document.getElementById('class').value.trim();
        const address = document.getElementById('address').value.trim();

        // Validate required fields
        if (!studentId || !name || !email || !contact) {
            alert('Please fill in all required fields');
            return;
        }

        // Validate input formats
        if (!/^\d+$/.test(studentId)) {
            alert('Student ID must contain only numbers');
            return;
        }

        if (!/^[a-zA-Z\s]+$/.test(name)) {
            alert('Student name must contain only letters');
            return;
        }

        if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        if (!/^\d{10}$/.test(contact)) {
            alert('Contact number must be 10 digits');
            return;
        }

        const studentData = {
            id: studentId,
            name: name,
            email: email,
            contact: contact,
            class: studentClass,
            address: address
        };

        // Validate student ID uniqueness when adding new record
        if (editIndex === null) {
            const idExists = students.some(student => student.id === studentData.id);
            if (idExists) {
                alert('Student ID already exists!');
                return;
            }
        }

        if (editIndex !== null) {
            // Update existing student
            students[editIndex] = studentData;
            editIndex = null;
            document.querySelector('.btn-submit').textContent = 'Save Student';
        } else {
            // Add new student
            students.push(studentData);
        }

        // Save to localStorage
        localStorage.setItem('students', JSON.stringify(students));
        
        // Refresh display
        displayStudents();
        
        // Reset form
        form.reset();

        // Scroll to records section
        document.getElementById('student-records').scrollIntoView({ behavior: 'smooth' });
    });

    // Search functionality
    searchBtn.addEventListener('click', filterStudents);
    searchInput.addEventListener('input', filterStudents);

    function filterStudents() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredStudents = students.filter(student => 
            student.name.toLowerCase().includes(searchTerm) ||
            student.id.toLowerCase().includes(searchTerm) ||
            student.email.toLowerCase().includes(searchTerm) ||
            student.contact.toLowerCase().includes(searchTerm)
        );
        displayStudents(filteredStudents);
    }

    // Display students function
    function displayStudents(studentsToDisplay = students) {
        tableBody.innerHTML = '';
        
        if (studentsToDisplay.length === 0) {
            noRecords.style.display = 'block';
            countElement.textContent = '0';
            tableContainer.style.overflowY = 'hidden';
            return;
        }
        
        noRecords.style.display = 'none';
        countElement.textContent = studentsToDisplay.length;
        
        // Add vertical scrollbar if more than 5 records
        if (studentsToDisplay.length > 5) {
            tableContainer.style.overflowY = 'auto';
            tableContainer.style.maxHeight = '400px';
        } else {
            tableContainer.style.overflowY = 'hidden';
        }
        
        studentsToDisplay.forEach((student, index) => {
            const originalIndex = students.findIndex(s => s.id === student.id);
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${student.contact}</td>
                <td>${student.class || '-'}</td>
                <td class="action-btns">
                    <button class="btn-edit" data-id="${originalIndex}">Edit</button>
                    <button class="btn-delete" data-id="${originalIndex}">Delete</button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });

        // Add event listeners to action buttons
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function() {
                editIndex = parseInt(this.getAttribute('data-id'));
                const student = students[editIndex];
                
                // Fill form with student data
                document.getElementById('student-id').value = student.id;
                document.getElementById('name').value = student.name;
                document.getElementById('email').value = student.email;
                document.getElementById('contact').value = student.contact;
                document.getElementById('class').value = student.class;
                document.getElementById('address').value = student.address;
                
                // Change button text
                document.querySelector('.btn-submit').textContent = 'Update Student';
                
                // Scroll to form
                document.getElementById('student-form').scrollIntoView({ behavior: 'smooth' });
            });
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-id'));
                if (confirm('Are you sure you want to delete this student?')) {
                    students.splice(index, 1);
                    localStorage.setItem('students', JSON.stringify(students));
                    displayStudents();
                    
                    // Reset form if editing the deleted record
                    if (editIndex === index) {
                        form.reset();
                        editIndex = null;
                        document.querySelector('.btn-submit').textContent = 'Save Student';
                    }
                }
            });
        });
    }

    /* ====================== */
    /* MODAL FUNCTIONS */
    /* ====================== */

    // Open modals when footer links are clicked
    privacyLink.addEventListener('click', function(e) {
        e.preventDefault();
        privacyModal.style.display = 'block';
    });

    termsLink.addEventListener('click', function(e) {
        e.preventDefault();
        termsModal.style.display = 'block';
    });

    contactLink.addEventListener('click', function(e) {
        e.preventDefault();
        contactModal.style.display = 'block';
    });

    // Close modals when close button is clicked
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Close contact modal when cancel button is clicked
    if (closeContactBtn) {
        closeContactBtn.addEventListener('click', function() {
            contactModal.style.display = 'none';
        });
    }

    // Close modals when clicking outside modal content
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const subject = document.getElementById('contact-subject').value.trim();
            const message = document.getElementById('contact-message').value.trim();
            
            // Validate required fields
            if (!name || !email || !message) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Validate email format
            if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // In a real application, you would send this data to a server
            console.log('Contact form submitted:', { name, email, subject, message });
            
            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
            
            // Reset form and close modal
            contactForm.reset();
            contactModal.style.display = 'none';
        });
    }

    // Initial display of student records
    displayStudents();
});