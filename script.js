/* ==========================================
   SIMOBISKRIP
   JavaScript
========================================== */


/* ================= NAVIGASI ================= */

const menuItems = document.querySelectorAll(".menu-item");
const pages = document.querySelectorAll(".page");

const pageTitles = {

    dashboard: {
        title: "Dashboard",
        subtitle: "Pantau perkembangan proses bimbingan dan revisi skripsimu."
    },

    kuota: {
        title: "Kuota Bimbingan",
        subtitle: "Pilih dan ambil slot bimbingan dosen yang masih tersedia."
    },

    jadwal: {
        title: "Jadwal Bimbingan",
        subtitle: "Kelola dan pantau jadwal bimbingan skripsi."
    },

    revisi: {
        title: "Revisi Skripsi",
        subtitle: "Pantau status revisi yang diberikan oleh dosen pembimbing."
    },

    dokumen: {
        title: "Dokumen",
        subtitle: "Kelola dokumen yang berkaitan dengan proses skripsi."
    },

    progress: {
        title: "Progress Skripsi",
        subtitle: "Pantau perkembangan pengerjaan skripsimu."
    },

    notifikasi: {
        title: "Notifikasi",
        subtitle: "Informasi terbaru mengenai proses skripsimu."
    },

    ai: {
        title: "AI Assistant",
        subtitle: "Asisten informasi untuk membantu melihat data skripsimu."
    },

    profil: {
        title: "Profil",
        subtitle: "Informasi akun mahasiswa."
    }

};


function openPage(pageName) {

    pages.forEach(page => {
        page.classList.remove("active-page");
    });

    menuItems.forEach(item => {
        item.classList.remove("active");
    });

    const targetPage = document.getElementById(pageName);

    const targetMenu = document.querySelector(
        `.menu-item[data-page="${pageName}"]`
    );

    if (targetPage) {
        targetPage.classList.add("active-page");
    }

    if (targetMenu) {
        targetMenu.classList.add("active");
    }

    if (pageTitles[pageName]) {

        document.getElementById("pageTitle").textContent =
            pageTitles[pageName].title;

        document.getElementById("pageSubtitle").textContent =
            pageTitles[pageName].subtitle;

    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


menuItems.forEach(item => {

    item.addEventListener("click", () => {

        const page = item.dataset.page;

        openPage(page);

    });

});


/* ================= TOAST ================= */

let toastTimer;

function showAlert(message) {

    const toast = document.getElementById("toast");

    const toastText = document.getElementById("toastText");

    if (!toast || !toastText) {
        alert(message);
        return;
    }

    toastText.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


/* ================= LOGOUT ================= */

function logout() {

    const confirmLogout = confirm(
        "Apakah kamu yakin ingin keluar?"
    );

    if (confirmLogout) {

        showAlert(
            "Berhasil keluar dari sistem."
        );

    }

}


/* ================= NOTIFIKASI ================= */

function markAllRead() {

    const notifications = document.querySelectorAll(
        ".notification.unread"
    );

    notifications.forEach(notification => {

        notification.classList.remove("unread");

    });


    const badge = document.querySelector(
        '.menu-item[data-page="notifikasi"] .badge'
    );

    const headerBadge =
        document.querySelector(".notification-btn span");


    if (badge) {
        badge.style.display = "none";
    }

    if (headerBadge) {
        headerBadge.style.display = "none";
    }


    showAlert(
        "Semua notifikasi telah ditandai sebagai dibaca."
    );

}


/* ==================================================
   AI ASSISTANT
================================================== */

function addChatMessage(message, type = "assistant") {

    const chatBox =
        document.getElementById("chatBox");

    if (!chatBox) {
        return;
    }

    const chat =
        document.createElement("div");

    chat.className =
        `chat ${type}`;


    if (type === "assistant") {

        chat.innerHTML = `
            <div class="chat-avatar">✦</div>
            <div class="chat-message">${message}</div>
        `;

    } else {

        chat.innerHTML = `
            <div class="chat-message">${message}</div>
        `;

    }


    chatBox.appendChild(chat);

    chatBox.scrollTop =
        chatBox.scrollHeight;

}


function askAI(question) {

    addChatMessage(
        question,
        "user"
    );


    setTimeout(() => {

        let response = "";

        const text =
            question.toLowerCase();


        /* ================= JADWAL ================= */

        if (
            text.includes("jadwal") ||
            text.includes("bimbingan")
        ) {

            response =
                "Jadwal bimbingan kamu berikutnya adalah <strong>15 September 2026 pukul 10.00 WIB</strong> di ruang K3.A.310 bersama <strong>Dr. Ahmad Fauzan</strong>.";

        }


        /* ================= PROGRESS ================= */

        else if (
            text.includes("progress") ||
            text.includes("progres")
        ) {

            response =
                "Progress skripsi kamu saat ini adalah <strong>65%</strong>. Tahapan yang sedang berjalan adalah bimbingan dan revisi.";

        }


        /* ================= REVISI ================= */

        else if (
            text.includes("revisi")
        ) {

            response =
                "Saat ini terdapat <strong>3 revisi aktif</strong>, yaitu revisi BAB III, BAB IV, dan BAB V.";

        }


        /* ================= DOKUMEN ================= */

        else if (
            text.includes("dokumen")
        ) {

            response =
                "Saat ini terdapat <strong>12 dokumen</strong> yang tersimpan dalam sistem.";

        }


        /* ================= DOSEN ================= */

        else if (
            text.includes("dosen") ||
            text.includes("pembimbing")
        ) {

            response =
                "Dosen pembimbing kamu adalah <strong>Dr. Ahmad Fauzan</strong>.";

        }


        /* ================= KUOTA ================= */

        else if (
            text.includes("kuota") ||
            text.includes("slot") ||
            text.includes("war")
        ) {

            const used =
                getCurrentQuota();

            const available =
                MAX_QUOTA - used;

            response =
                `Kuota bimbingan Dr. Ahmad Fauzan saat ini adalah <strong>${used}/10 mahasiswa</strong>. Slot yang masih tersedia <strong>${available}</strong>.`;

        }


        /* ================= DEFAULT ================= */

        else {

            response =
                "Saya dapat membantu memberikan informasi mengenai <strong>jadwal bimbingan, kuota dosen, progress, revisi, dokumen, dan dosen pembimbing</strong>.";

        }


        addChatMessage(
            response,
            "assistant"
        );

    }, 600);

}


function sendAI() {

    const input =
        document.getElementById("aiInput");

    if (!input) {
        return;
    }

    const question =
        input.value.trim();


    if (question === "") {
        return;
    }


    askAI(question);

    input.value = "";

}


/* ==================================================
   FILTER JADWAL
================================================== */

const filters =
    document.querySelectorAll(".filter");


filters.forEach(filter => {

    filter.addEventListener("click", () => {

        filters.forEach(item => {

            item.classList.remove("active");

        });


        filter.classList.add("active");


        showAlert(
            `Filter "${filter.textContent}" dipilih.`
        );

    });

});


/* ==================================================
   KUOTA BIMBINGAN DOSEN

   Maksimal:
   10 mahasiswa / dosen / hari
================================================== */

const MAX_QUOTA = 10;


/* ==================================================
   DATA KUOTA
================================================== */

const quotaData = {

    ahmad: {

        "2026-10-12": {

            used: 7,

            students: [

                {
                    name: "Budi Santoso",
                    nim: "43050240012"
                },

                {
                    name: "Siti Aminah",
                    nim: "43050240018"
                },

                {
                    name: "Rizky Pratama",
                    nim: "43050240021"
                },

                {
                    name: "Nadia Putri",
                    nim: "43050240025"
                },

                {
                    name: "Fajar Ramadhan",
                    nim: "43050240031"
                },

                {
                    name: "Putri Lestari",
                    nim: "43050240036"
                },

                {
                    name: "Andi Pratama",
                    nim: "43050240041"
                }

            ]

        }

    },


    siti: {

        "2026-10-12": {

            used: 4,

            students: [

                {
                    name: "Andi Saputra",
                    nim: "43050240041"
                },

                {
                    name: "Dina Permata",
                    nim: "43050240044"
                },

                {
                    name: "Rina Amelia",
                    nim: "43050240048"
                },

                {
                    name: "Galih Prakoso",
                    nim: "43050240051"
                }

            ]

        }

    },


    budi: {

        "2026-10-12": {

            used: 10,

            students: [

                {
                    name: "Mahasiswa 1",
                    nim: "43050240055"
                },

                {
                    name: "Mahasiswa 2",
                    nim: "43050240056"
                },

                {
                    name: "Mahasiswa 3",
                    nim: "43050240057"
                },

                {
                    name: "Mahasiswa 4",
                    nim: "43050240058"
                },

                {
                    name: "Mahasiswa 5",
                    nim: "43050240059"
                },

                {
                    name: "Mahasiswa 6",
                    nim: "43050240060"
                },

                {
                    name: "Mahasiswa 7",
                    nim: "43050240061"
                },

                {
                    name: "Mahasiswa 8",
                    nim: "43050240062"
                },

                {
                    name: "Mahasiswa 9",
                    nim: "43050240063"
                },

                {
                    name: "Mahasiswa 10",
                    nim: "43050240064"
                }

            ]

        }

    }

};


/* ==================================================
   DATA JADWAL TAMBAHAN DARI SLOT YANG DIAMBIL
================================================== */

let bookedSchedules = [];


/* ==================================================
   AMBIL DATA KUOTA
================================================== */

function getQuotaData() {

    const lecturer =
        document.getElementById(
            "quotaLecturer"
        );

    const date =
        document.getElementById(
            "quotaDate"
        );


    if (!lecturer || !date) {
        return null;
    }


    const lecturerId =
        lecturer.value;

    const selectedDate =
        date.value;


    if (!lecturerId || !selectedDate) {
        return null;
    }


    if (
        !quotaData[lecturerId]
    ) {

        quotaData[lecturerId] = {};

    }


    if (
        !quotaData[lecturerId][selectedDate]
    ) {

        quotaData[lecturerId][selectedDate] = {

            used: 0,

            students: []

        };

    }


    return quotaData[lecturerId][selectedDate];

}


/* ==================================================
   CEK KUOTA SAAT INI
================================================== */

function getCurrentQuota() {

    const data =
        getQuotaData();

    if (!data) {
        return 0;
    }

    return data.used;

}


/* ==================================================
   UPDATE KUOTA
================================================== */

function updateQuota() {

    const data =
        getQuotaData();


    if (!data) {
        return;
    }


    const used =
        data.used;


    const available =
        MAX_QUOTA - used;


    const percentage =
        Math.round(
            (used / MAX_QUOTA) * 100
        );


    const quotaUsed =
        document.getElementById(
            "quotaUsed"
        );

    const quotaAvailable =
        document.getElementById(
            "quotaAvailable"
        );

    const quotaPercentage =
        document.getElementById(
            "quotaPercentage"
        );

    const quotaProgressBar =
        document.getElementById(
            "quotaProgressBar"
        );

    const studentCount =
        document.getElementById(
            "studentCount"
        );

    const button =
        document.getElementById(
            "takeQuotaBtn"
        );

    const quotaInfoAvailable =
        document.getElementById(
            "quotaInfoAvailable"
        );


    /* ================= KUOTA TERISI ================= */

    if (quotaUsed) {

        quotaUsed.textContent =
            `${used} / ${MAX_QUOTA}`;

    }


    /* ================= SLOT TERSEDIA ================= */

    if (quotaAvailable) {

        quotaAvailable.textContent =
            available;

    }


    /* ================= PERSENTASE ================= */

    if (quotaPercentage) {

        quotaPercentage.textContent =
            `${percentage}%`;

    }


    /* ================= PROGRESS BAR ================= */

    if (quotaProgressBar) {

        quotaProgressBar.style.width =
            `${percentage}%`;

    }


    /* ================= JUMLAH MAHASISWA ================= */

    if (studentCount) {

        studentCount.textContent =
            `${used} mahasiswa`;

    }


    /* ================= INFORMASI SLOT ================= */

    if (quotaInfoAvailable) {

        quotaInfoAvailable.textContent =
            `${available} slot`;

    }


    /* ================= TOMBOL ================= */

    if (button) {

        if (available <= 0) {

            button.textContent =
                "✕ Kuota Penuh";

            button.disabled =
                true;

        } else {

            button.textContent =
                "✓ Ambil Slot Bimbingan";

            button.disabled =
                false;

        }

    }


    /* ================= DAFTAR MAHASISWA ================= */

    renderStudents(
        data.students
    );

}


/* ==================================================
   TAMPILKAN DAFTAR MAHASISWA
================================================== */

function renderStudents(students) {

    const list =
        document.getElementById(
            "studentSlotList"
        );


    if (!list) {
        return;
    }


    list.innerHTML = "";


    if (
        !students ||
        students.length === 0
    ) {

        list.innerHTML = `
            <div class="empty-slot">
                Belum ada mahasiswa yang mengambil slot.
            </div>
        `;

        return;

    }


    students.forEach(
        (student, index) => {

            const studentItem =
                document.createElement(
                    "div"
                );

            studentItem.className =
                "student-slot";


            studentItem.innerHTML = `

                <span class="slot-number">
                    ${index + 1}
                </span>

                <div>

                    <strong>
                        ${student.name}
                    </strong>

                    <small>
                        ${student.nim}
                    </small>

                </div>

                <span class="slot-status">
                    Slot ${index + 1}
                </span>

            `;


            list.appendChild(
                studentItem
            );

        }
    );

}


/* ==================================================
   AMBIL SLOT BIMBINGAN
================================================== */

function takeQuota() {

    const lecturer =
        document.getElementById(
            "quotaLecturer"
        );

    const date =
        document.getElementById(
            "quotaDate"
        );


    if (!lecturer || !date) {
        return;
    }


    const lecturerId =
        lecturer.value;

    const selectedDate =
        date.value;


    if (!selectedDate) {

        showAlert(
            "Silakan pilih tanggal bimbingan terlebih dahulu."
        );

        return;

    }


    const data =
        getQuotaData();


    if (!data) {
        return;
    }


    /* ================= CEK SUDAH BOOKING ================= */

    const alreadyBooked =
        data.students.some(
            student =>
                student.nim === "43050240005"
        );


    if (alreadyBooked) {

        showAlert(
            "Kamu sudah mengambil slot pada tanggal tersebut."
        );

        return;

    }


    /* ================= CEK KUOTA ================= */

    if (
        data.used >= MAX_QUOTA
    ) {

        showAlert(
            "Maaf, kuota bimbingan dosen sudah penuh."
        );

        updateQuota();

        return;

    }


    /* ================= NAMA DOSEN ================= */

    const lecturerName =
        lecturer.options[
            lecturer.selectedIndex
        ].text;


    /* ================= NOMOR SLOT ================= */

    const slotNumber =
        data.used + 1;


    /* ================= KONFIRMASI ================= */

    const confirmation =
        confirm(

            "Kamu akan mengambil slot bimbingan.\n\n" +

            "Dosen: " +
            lecturerName +

            "\nTanggal: " +
            formatDate(selectedDate) +

            "\nSlot yang akan kamu dapatkan: " +
            slotNumber +

            " / " +
            MAX_QUOTA +

            "\n\nLanjutkan mengambil slot?"

        );


    if (!confirmation) {
        return;
    }


    /* ================= TAMBAHKAN MAHASISWA ================= */

    data.used++;


    data.students.push({

        name: "Femi Aulia Andini",

        nim: "43050240005"

    });


    /* ================= SIMPAN JADWAL ================= */

    const newSchedule = {

        number: slotNumber,

        lecturerId: lecturerId,

        lecturerName: lecturerName,

        date: selectedDate,

        time: "10.00 - 11.00",

        room: getRoom(lecturerId),

        status: "Mendatang"

    };


    bookedSchedules.push(
        newSchedule
    );


    /* ================= UPDATE KUOTA ================= */

    updateQuota();


    /* ================= UPDATE JADWAL ================= */

    renderBookedSchedules();


    /* ================= PESAN BERHASIL ================= */

    const remaining =
        MAX_QUOTA -
        data.used;


    showAlert(

        "Berhasil mengambil slot bimbingan! " +

        "Slot kamu adalah nomor " +
        slotNumber +

        ". Sisa kuota: " +
        remaining

    );

}


/* ==================================================
   MENENTUKAN RUANGAN DOSEN
================================================== */

function getRoom(lecturerId) {

    if (lecturerId === "ahmad") {

        return "K3.A.310";

    }


    if (lecturerId === "siti") {

        return "K3.C.302";

    }


    if (lecturerId === "budi") {

        return "K3.B.315";

    }


    return "K3.A.310";

}


/* ==================================================
   TAMPILKAN JADWAL HASIL PENGAMBILAN SLOT
================================================== */

function renderBookedSchedules() {

    const tableBody =
        document.getElementById(
            "scheduleTableBody"
        );


    if (!tableBody) {
        return;
    }


    /* Jika belum ada jadwal baru */

    if (
        bookedSchedules.length === 0
    ) {

        return;

    }


    bookedSchedules.forEach(
        schedule => {

            const existingRow =
                document.querySelector(
                    `tr[data-schedule-id="${schedule.number}-${schedule.date}"]`
                );


            if (existingRow) {
                return;
            }


            const row =
                document.createElement(
                    "tr"
                );


            row.setAttribute(
                "data-schedule-id",
                `${schedule.number}-${schedule.date}`
            );


            row.innerHTML = `

                <td>
                    ${schedule.number}
                </td>

                <td>
                    ${formatDateShort(schedule.date)}
                </td>

                <td>
                    ${schedule.time}
                </td>

                <td>
                    ${schedule.lecturerName}
                </td>

                <td>
                    ${schedule.room}
                </td>

                <td>

                    <span class="status upcoming">
                        ${schedule.status}
                    </span>

                </td>

            `;


            /*
             * Jadwal baru ditaruh
             * paling atas.
             */

            tableBody.prepend(
                row
            );

        }
    );

}


/* ==================================================
   FORMAT TANGGAL LENGKAP
================================================== */

function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }


    const date =
        new Date(
            dateString + "T00:00:00"
        );


    const months = [

        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember"

    ];


    return (

        date.getDate() +
        " " +
        months[date.getMonth()] +
        " " +
        date.getFullYear()

    );

}


/* ==================================================
   FORMAT TANGGAL SINGKAT
================================================== */

function formatDateShort(dateString) {

    if (!dateString) {
        return "-";
    }


    const date =
        new Date(
            dateString + "T00:00:00"
        );


    const months = [

        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Agu",
        "Sep",
        "Okt",
        "Nov",
        "Des"

    ];


    return (

        date.getDate() +
        " " +
        months[date.getMonth()] +
        " " +
        date.getFullYear()

    );

}


/* ==================================================
   WAR SLOT LAMA
================================================== */

function warSlot(
    namaDosen,
    sisaSlot
) {

    if (
        sisaSlot <= 0
    ) {

        showAlert(
            "Maaf, kuota dosen sudah penuh."
        );

        return;

    }


    const konfirmasi =
        confirm(

            "Kamu akan mengambil slot bimbingan dengan " +
            namaDosen +

            ".\n\nSisa slot saat ini: " +
            sisaSlot +

            "\n\nLanjutkan war slot?"

        );


    if (konfirmasi) {

        showAlert(

            "Berhasil mengambil slot bimbingan dengan " +
            namaDosen +
            "!"

        );

    }

}


/* ==================================================
   TOMBOL AJUKAN BIMBINGAN
================================================== */

document.addEventListener(
    "click",
    function(event) {

        if (
            event.target.classList.contains(
                "primary-btn"
            )
        ) {

            /*
             * Tombol lain yang sudah mempunyai
             * onclick tidak diganggu.
             */

        }

    }
);


/* ==================================================
   UPDATE OTOMATIS SAAT DOSEN / TANGGAL BERUBAH
================================================== */

document.addEventListener(
    "change",
    function(event) {

        if (
            event.target.id === "quotaLecturer" ||
            event.target.id === "quotaDate"
        ) {

            updateQuota();

        }

    }
);


/* ==================================================
   INITIAL
================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        openPage("dashboard");

        /*
         * Memastikan data kuota
         * langsung tampil ketika halaman
         * Kuota Bimbingan dibuka.
         */

        updateQuota();

        /*
         * Memastikan jadwal hasil pengambilan
         * slot ditampilkan.
         */

        renderBookedSchedules();

    }
);