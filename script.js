// Definizione dei turni
const shifts = [
    {
        name: "Turno di mattina",
        time: "6:00 - 14:00",
        className: "morning"
    },
    {
        name: "Turno di notte",
        time: "22:00 - 6:00",
        className: "night"
    },
    {
        name: "Turno di pomeriggio",
        time: "14:00 - 22:00",
        className: "afternoon"
    }
];

// Imposta il calendario su dicembre 2024
let currentDate = new Date(2024, 11, 1); // Dicembre 2024

// Array dei giorni della settimana per visualizzazione
const weekDays = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];

function generateCalendar(date) {
    const calendarBody = document.getElementById('calendar').getElementsByTagName('tbody')[0];
    calendarBody.innerHTML = '';

    const month = date.getMonth();
    const year = date.getFullYear();

    // Imposta il mese e l'anno nell'intestazione
    const monthYear = document.getElementById('monthYear');
    const monthNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
        'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
    monthYear.textContent = `${monthNames[month]} ${year}`;

    // Primo giorno del mese
    const firstDay = new Date(year, month, 1);
    // Indice del primo giorno della settimana, adattato per iniziare da lunedì (0)
    let startingDay = (firstDay.getDay() + 6) % 7;

    // Numero di giorni nel mese
    const monthLength = new Date(year, month + 1, 0).getDate();

    // Numero di giorni nel mese precedente
    const prevMonthDays = new Date(year, month, 0).getDate();

    let day = 1;
    let nextMonthDay = 1;

    // Calcola il numero di righe necessarie nel calendario
    const totalRows = Math.ceil((startingDay + monthLength) / 7);

    // Genera le righe del calendario
    for (let i = 0; i < totalRows; i++) {
        const row = document.createElement('tr');

        // Genera le celle per ogni giorno
        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('td');
            const cellDiv = document.createElement('div');
            cellDiv.classList.add('day-number');

            // Giorni del mese precedente
            if (i === 0 && j < startingDay) {
                let prevDay = prevMonthDays - (startingDay - j - 1);
                cellDiv.textContent = prevDay;
                cell.classList.add('other-month');
                cell.appendChild(cellDiv);
            }
            // Giorni del mese successivo
            else if (day > monthLength) {
                cellDiv.textContent = nextMonthDay++;
                cell.classList.add('other-month');
                cell.appendChild(cellDiv);
            }
            // Giorni del mese corrente
            else {
                cellDiv.textContent = day;
                cell.appendChild(cellDiv);

                // Evidenzia il giorno corrente (se il mese e l'anno correnti corrispondono)
                const today = new Date();
                if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                    cell.classList.add('today');
                }

                // Aggiungi il turno al giorno
                const date = new Date(year, month, day);
                const shift = getShiftForDate(date);
                if (shift) {
                    const shiftDiv = document.createElement('div');
                    shiftDiv.className = `shift ${shift.className}`;
                    shiftDiv.textContent = shift.name;
                    cell.appendChild(shiftDiv);
                }
                day++;
            }

            row.appendChild(cell);
        }

        calendarBody.appendChild(row);
    }
}

// Funzione per calcolare il turno per una data specifica
function getShiftForDate(date) {
    // Imposta la data di inizio al 9 dicembre 2024 (lunedì)
    const startDate = new Date(2024, 11, 9); // Dicembre è 11
    // Calcola la differenza in millisecondi tra la data corrente e la data di inizio
    const timeDiff = date - startDate;
    // Converte la differenza in settimane
    const weekNumber = Math.floor(timeDiff / (7 * 24 * 60 * 60 * 1000));
    // Calcola l'indice del turno
    const shiftIndex = ((weekNumber % shifts.length) + shifts.length) % shifts.length;
    return shifts[shiftIndex];
}
// Funzione per calcolare il giorno della settimana e il turno di lavoro
function searchByDate() {
    const searchDateInput = document.getElementById('searchDate').value;
    const searchResult = document.getElementById('searchResult');

    if (!searchDateInput) {
        searchResult.textContent = "Inserisci una data valida.";
        return;
    }

    const date = new Date(searchDateInput);
    const dayOfWeek = weekDays[date.getDay() === 0 ? 6 : date.getDay() - 1]; // Adatta per iniziare da lunedì
    const shift = getShiftForDate(date);

    if (shift) {
        searchResult.textContent = `Il ${dayOfWeek} ${date.toLocaleDateString()} è un ${shift.name} (${shift.time}).`;
    } else {
        searchResult.textContent = `Il ${dayOfWeek} ${date.toLocaleDateString()} non ha turni assegnati.`;
    }
}

// Aggiungi un event listener al pulsante di ricerca
document.getElementById('searchButton').addEventListener('click', searchByDate);

// Navigazione tra mesi e anni
document.getElementById('prevMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar(currentDate);
});

document.getElementById('nextMonth').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar(currentDate);
});

document.getElementById('prevYear').addEventListener('click', () => {
    currentDate.setFullYear(currentDate.getFullYear() - 1);
    generateCalendar(currentDate);
});

document.getElementById('nextYear').addEventListener('click', () => {
    currentDate.setFullYear(currentDate.getFullYear() + 1);
    generateCalendar(currentDate);
});

// Genera il calendario all'avvio
generateCalendar(currentDate);