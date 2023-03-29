let button = document.getElementById("dateButton");

let calenderExpanded = false;

const DAY_DEFAULT_COLOR = "#E1DCDC20";
const DAY_SELECTED_COLOR = "blue";

const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

let date = new Date();
let month = monthNames[date.getMonth()];

let userData = {
    progress: 0,
    selectedStartDay: -1,
    selectedEndDay: -1,
    selectedStartMonth: -1,
    selectedEndMonth: -1,
    selectedStartYear: -1,
    selectedEndYear: -1,
    selectedMonth: date.getMonth(),
    selectedYear: date.getFullYear(),
};

//#region mousemove stuff

function mouseCoordinates(event){
    mousePosition = {
        x: event.clientX,
        y: event.clientY,
    }
}

let mousePosition = {
    x: 0,
    y: 0
}

document.onmousemove = mouseCoordinates;

//#endregion mousemove stuff

button.addEventListener("click", function() {
    if (calenderExpanded) {
        return;
    }
    
    calenderExpanded = true;
    
    let date = new Date();

    let monthDayCount = getDaysInMonth(date.getMonth(), date.getFullYear());
    let day = date.getDay();

    console.log(monthDayCount + "days in this month (" + month + ")");

    // the calender container (will contain everything)
    let calenderContainer = document.createElement("div");
    calenderContainer.classList.add("calenderContainer");

    // monthContainer to contain all the days
    let year = document.createElement("div");
    year.innerText = userData.selectedYear;
    year.classList.add("year");

    // add month container to calender container
    calenderContainer.appendChild(year);

    // display the month name at the top
    let monthNameContainer = document.createElement("div");
    monthNameContainer.classList.add("monthNameContainer");
    
    // add month name onto the calender container
    calenderContainer.appendChild(monthNameContainer);

    //#region month controls

    let prevMonthButton = document.createElement("div");
    prevMonthButton.innerText = "<";
    prevMonthButton.classList = "monthButton prevMonthButton";
    prevMonthButton.addEventListener("click", function() {
        userData.selectedMonth--;
        if (userData.selectedMonth < 0) {
            userData.selectedMonth = 11;
            userData.selectedYear--;
        }
        fixMonth();
        if (userData.progress == 2) {
            console.log("highlighting days")
            highlightDays()
        }
    })
    monthNameContainer.appendChild(prevMonthButton);

    let monthName = document.createElement("div");
    monthName.classList.add("monthName");
    monthName.innerText = monthNames[userData.selectedMonth];
    monthNameContainer.appendChild(monthName);

    let nextMonthButton = document.createElement("div");
    nextMonthButton.innerText = ">";
    nextMonthButton.classList = "monthButton nextMonthButton";
    nextMonthButton.addEventListener("click", function() {
        userData.selectedMonth++;
        if (userData.selectedMonth > 11) {
            userData.selectedMonth = 0;
            userData.selectedYear++;
        }
        fixMonth();
        if (userData.progress == 2) {
            console.log("highlighting days")
            highlightDays()
        }
    })
    monthNameContainer.appendChild(nextMonthButton);

    //#endregion month controls

    // monthContainer to contain all the days
    let monthContainer = document.createElement("div");
    monthContainer.classList.add("monthContainer");

    // add month container to calender container
    calenderContainer.appendChild(monthContainer);

    let confirmButton = document.createElement("div");
    confirmButton.classList.add("confirmButton");
    confirmButton.style.display = "none"; // hide button by default
    confirmButton.innerText = "Confirm Days";

    confirmButton.addEventListener("click", function() {
        calenderContainer.remove();
        calenderExpanded = false;
        userData.progress = 0;
        return;
    })

    calenderContainer.appendChild(confirmButton);

    // generate day boxes
    generateDays(monthDayCount, monthContainer, confirmButton);

    document.body.appendChild(calenderContainer);
    calenderContainer.style.left = mousePosition.x + "px";
    calenderContainer.style.top = mousePosition.y + "px";
})

function getDaysInMonth(month,year) {
    return new Date(year, month, 0).getDate();
};

function fixMonth() {
    let monthContainer = document.getElementsByClassName("monthContainer")[0];
    monthContainer.innerHTML = "";
    document.getElementsByClassName("monthName")[0].innerText = monthNames[userData.selectedMonth];
    document.getElementsByClassName("year")[0].innerText = userData.selectedYear;

    let monthDayCount = getDaysInMonth(userData.selectedMonth, date.getFullYear());

    let confirmButton = document.getElementsByClassName("confirmButton")[0]

    generateDays(monthDayCount, monthContainer, confirmButton);
}

function generateDays(x, y, z) {
    for (let i = 1; i < x + 1; i++) {
        console.log("rendering day " + i);

        let day = document.createElement("div");
        day.classList.add("dayBox");
        day.id = i;
        day.innerText = i;

        day.addEventListener("click", function() {
            if (userData.progress == 0) {
                this.style.backgroundColor = "blue";
                userData.selectedStartDay = parseInt(this.id);
                userData.selectedStartMonth = userData.selectedMonth;
                userData.selectedStartYear = userData.selectedYear;
                userData.progress++;
            } else if (userData.progress == 1) {
                userData.selectedEndDay = parseInt(this.id);
                userData.selectedEndMonth = userData.selectedMonth;
                userData.selectedEndYear = userData.selectedYear;

                validateUserData();

                //let monthDayCount = getDaysInMonth(userData.selectedMonth, userData.selectedYear);

                highlightDays();

                userData.progress++;
                z.style.display = "block";
            } else if (userData.progress == 2) {
                
                let monthDayCount = getDaysInMonth(userData.selectedMonth, userData.selectedYear);

                for (let i2 = 1; i2 < monthDayCount + 1; i2++) {
                    document.getElementById(i2).style.backgroundColor = DAY_DEFAULT_COLOR;
                }
                
                userData.selectedStartDay = parseInt(this.id);
                userData.selectedStartMonth = userData.selectedMonth;
                userData.selectedStartYear = userData.selectedYear;
                this.style.backgroundColor = "blue";
                userData.progress = 1;
                z.style.display = "none";
            }
        });

        y.appendChild(day);
    }
}

function highlightDays() {
    let start = 0;
    let end = 0;

    let flags = {
        flipDirections: false,
        addedMonths: 0,
        swappedDays: false,
    }

    /*if (userData.selectedYear < userData.selectedStartYear || userData.selectedYear > userData.selectedEndYear) {
        return;
    }*/
    
    if (userData.selectedEndYear != userData.selectedStartYear) {
        if (userData.selectedStartYear < userData.selectedEndYear) {  
            userData.selectedEndMonth += 12; // correctly visualized behavior, i promise
            // this will make the below code think our date still happens "after", sort of an override if you will.
            
            flags.flipDirections = true;
            flags.addedMonths = 12;
        }
        else if (userData.selectedStartYear > userData.selectedEndYear) {  
            // how could you start after youve ended? flip years!
            
            let _ = userData.selectedEndYear;
            userData.selectedEndYear = userData.selectedStartYear;
            userData.selectedEndYear = _;
    
            flags.flipDirections = true;

            // flip days temporarily to fix a bug involving displayed days swapping on their own
            /*
            _ = userData.selectedEndDay;
            userData.selectedEndDay = userData.selectedStartDay;
            userData.selectedStartDay = userData.selectedEndDay;

            flags.swappedDays = true; // flag will be set to later swap them back
            */
        }
    }    

    if (userData.selectedStartMonth == userData.selectedEndMonth && userData.selectedMonth == userData.selectedStartMonth) {
            
        start = userData.selectedStartDay;
        end = userData.selectedEndDay + 1;

        if (flags.flipDirections) {
            start = 1;
            end = getDaysInMonth(userData.selectedMonth, userData.selectedYear) + 1;
        }

    } else if (userData.selectedMonth == userData.selectedStartMonth && userData.selectedEndMonth > userData.selectedStartMonth) {
        
        start = userData.selectedStartDay;
        end = getDaysInMonth(userData.selectedMonth, userData.selectedYear) + 1;
    
        if (flags.flipDirections) {
            start = 1;
            end = userData.selectedEndDay + 1;
        }

    } else if (userData.selectedMonth == userData.selectedEndMonth && userData.selectedEndMonth > userData.selectedStartMonth) {
    
        start = 1;
        end = userData.selectedEndDay + 1;

        if (flags.flipDirections) {
            start = userData.selectedStartDay;
            end = getDaysInMonth(userData.selectedMonth, userData.selectedYear) + 1;
        }
    
    } else if (userData.selectedMonth > userData.selectedStartMonth && userData.selectedMonth < userData.selectedEndMonth) {
    
        start = 1;
        end = getDaysInMonth(userData.selectedMonth, userData.selectedYear) + 1;
    
        if (flags.flipDirections) {
            start = userData.selectedStartDay;
            end = userData.selectedEndDay + 1;
        }

    }

    for (let i2 = start; i2 < end; i2++) {
        document.getElementById(i2).style.backgroundColor = DAY_SELECTED_COLOR;
    }

    if (flags.swappedDays) { // swap back days for correct time
        let _ = userData.selectedEndYear;
        userData.selectedEndYear = userData.selectedStartYear;
        userData.selectedEndYear = _;
    }

    userData.selectedEndMonth -= flags.addedMonths; //subtract added months for correct time
}

function validateUserData() {
    if (userData.selectedStartYear == userData.selectedEndYear) {
        if (userData.selectedStartDay > userData.selectedEndDay) {
            if (userData.selectedStartMonth <= userData.selectedEndMonth) {
                let _ = userData.selectedEndDay;
                userData.selectedEndDay = userData.selectedStartDay;
                userData.selectedStartDay = _;
            }
            else {
                // flip days round
                let _ = userData.selectedEndDay;
                userData.selectedEndDay = userData.selectedStartDay;
                userData.selectedStartDay = _;
                // same for months
                _ = userData.selectedEndMonth;
                userData.selectedEndMonth = userData.selectedStartMonth;
                userData.selectedStartMonth = _;
            }
        }
    }
}
