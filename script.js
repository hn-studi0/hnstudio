document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       MOBILE NAVIGATION
    ========================================================= */

    const menu = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".nav");

    menu?.addEventListener("click", () => {

        const isOpen =
            nav.classList.toggle("mobile-open");

        menu.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menu.textContent =
            isOpen ? "×" : "☰";

    });


    nav?.querySelectorAll("a").forEach((link) => {

        link.addEventListener("click", () => {

            nav.classList.remove(
                "mobile-open"
            );

            menu?.setAttribute(
                "aria-expanded",
                "false"
            );

            if (menu) {
                menu.textContent = "☰";
            }

        });

    });


    /* =========================================================
       REVEAL ANIMATIONS
    ========================================================= */

    const revealElements =
        document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach((entry) => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "visible"
                            );

                            revealObserver.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );


        revealElements.forEach((element) => {

            revealObserver.observe(element);

        });

    } else {

        revealElements.forEach((element) => {

            element.classList.add("visible");

        });

    }


    /* =========================================================
       WORK FILTERS
    ========================================================= */

    const filters = [
        ...document.querySelectorAll(
            ".media-filter"
        )
    ];


    const cards = [
        ...document.querySelectorAll(
            ".media-wall > .media-card, .more-media .media-card"
        )
    ];


    const moreMedia =
        document.getElementById(
            "moreMedia"
        );


    filters.forEach((filter) => {

        filter.addEventListener(
            "click",
            () => {

                filters.forEach((item) => {

                    item.classList.remove(
                        "active"
                    );

                });


                filter.classList.add(
                    "active"
                );


                const type =
                    filter.dataset.filter;


                cards.forEach((card) => {

                    const shouldHide =
                        type !== "all" &&
                        card.dataset.type !== type;


                    card.classList.toggle(
                        "is-hidden",
                        shouldHide
                    );

                });


                if (
                    type !== "all" &&
                    moreMedia
                ) {

                    moreMedia.classList.add(
                        "open"
                    );

                }

            }
        );

    });


    /* =========================================================
       VIEW MORE WORK
    ========================================================= */

    const viewMoreButton =
        document.getElementById(
            "viewMoreBtn"
        );


    viewMoreButton?.addEventListener(
        "click",
        () => {

            if (!moreMedia) {
                return;
            }


            const open =
                moreMedia.classList.toggle(
                    "open"
                );


            const text =
                viewMoreButton.querySelector(
                    "span"
                );


            const icon =
                viewMoreButton.querySelector(
                    "b"
                );


            if (text) {

                text.textContent =
                    open
                        ? "SHOW LESS"
                        : "VIEW MORE WORK";

            }


            if (icon) {

                icon.textContent =
                    open
                        ? "−"
                        : "+";

            }


            if (!open) {

                document
                    .getElementById("work")
                    ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

            }

        }
    );


    /* =========================================================
       VIDEO BEHAVIOUR
    ========================================================= */

    const videos =
        document.querySelectorAll(
            "video"
        );


    videos.forEach((video) => {

        video.addEventListener(
            "play",
            () => {

                videos.forEach(
                    (otherVideo) => {

                        if (
                            otherVideo !== video
                        ) {

                            otherVideo.pause();

                        }

                    }
                );

            }
        );

    });


    /* =========================================================
       H&N PRICING / PACKAGE BUILDER
    ========================================================= */

    const packageButtons = [
        ...document.querySelectorAll(
            ".package-select"
        )
    ];


    const priceCheckboxes = [
        ...document.querySelectorAll(
            ".price-checkbox"
        )
    ];


    const selectedItems =
        document.getElementById(
            "selectedItems"
        );


    const totalPrice =
        document.getElementById(
            "totalPrice"
        );


    const clearSelection =
        document.getElementById(
            "clearSelection"
        );


    const continueBooking =
        document.getElementById(
            "continueBooking"
        );


    const vipSelect =
        document.getElementById(
            "vipSelect"
        );


    const customProjectButtons = [
        ...document.querySelectorAll(
            ".custom-project-btn"
        )
    ];


    const VIP_PRICE = 49999;


    let selectedPackage = null;

    let vipSelected = false;

    let selectedServices = [];


    /* =========================================================
       CURRENCY FORMATTER
    ========================================================= */

    function formatPrice(price) {

        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0
            }
        ).format(price);

    }


    /* =========================================================
       GET PACKAGE PRICE
    ========================================================= */

    function getPackagePrice(
        packageName
    ) {

        if (!packageName) {
            return 0;
        }


        const match =
            packageName.match(
                /₹\s*([\d,]+)/
            );


        if (!match) {
            return 0;
        }


        return Number(
            match[1].replace(
                /,/g,
                ""
            )
        );

    }


    /* =========================================================
       PACKAGE BUTTON STATE
    ========================================================= */

    function setPackageButtonState(
        button,
        selected
    ) {

        if (!button) {
            return;
        }


        button.classList.toggle(
            "selected",
            selected
        );


        const isCustom =
            button.dataset.package ===
            "H&N Custom Project";


        if (selected) {

            button.innerHTML =
                isCustom
                    ? `PROJECT SELECTED <span>✓</span>`
                    : `PACKAGE SELECTED <span>✓</span>`;

        } else {

            button.innerHTML =
                isCustom
                    ? `START A PROJECT <span>↗</span>`
                    : `SELECT PACKAGE <span>+</span>`;

        }

    }


    /* =========================================================
       VIP BUTTON STATE
    ========================================================= */

    function setVipButtonState(
        selected
    ) {

        if (!vipSelect) {
            return;
        }


        vipSelect.classList.toggle(
            "selected",
            selected
        );


        vipSelect.innerHTML =
            selected
                ? `VIP SELECTED <span>✓</span>`
                : `SELECT VIP <span>+</span>`;

    }


    /* =========================================================
       CLEAR SELECTED PACKAGE
    ========================================================= */

    function clearSelectedPackage() {

        selectedPackage = null;


        packageButtons.forEach(
            (button) => {

                setPackageButtonState(
                    button,
                    false
                );

            }
        );

    }


    /* =========================================================
       CLEAR INDIVIDUAL SERVICES
    ========================================================= */

    function clearIndividualServices() {

        priceCheckboxes.forEach(
            (checkbox) => {

                checkbox.checked =
                    false;

            }
        );


        selectedServices = [];

    }


    /* =========================================================
       UPDATE PACKAGE SUMMARY
    ========================================================= */

    function updatePackage() {

        selectedServices = [];


        /* -----------------------------------------------------
           CORE PACKAGE
        ----------------------------------------------------- */

        if (selectedPackage) {

            selectedServices.push({

                type: "package",

                name:
                    selectedPackage.name,

                price:
                    selectedPackage.price

            });

        }


        /* -----------------------------------------------------
           VIP PACKAGE
        ----------------------------------------------------- */

        if (vipSelected) {

            selectedServices.push({

                type: "vip",

                name:
                    "H&N VIP Experience",

                price:
                    VIP_PRICE

            });

        }


        /* -----------------------------------------------------
           INDIVIDUAL SERVICES
        ----------------------------------------------------- */

        if (
            !selectedPackage &&
            !vipSelected
        ) {

            priceCheckboxes.forEach(
                (checkbox) => {

                    if (
                        checkbox.checked
                    ) {

                        const price =
                            Number(
                                checkbox.dataset.price
                            );


                        selectedServices.push({

                            type: "service",

                            name:
                                checkbox.dataset.name ||
                                "Selected service",

                            price:
                                Number.isFinite(
                                    price
                                )
                                    ? price
                                    : 0

                        });

                    }

                }
            );

        }


        /* -----------------------------------------------------
           EMPTY STATE
        ----------------------------------------------------- */

        if (
            selectedServices.length === 0
        ) {

            if (selectedItems) {

                selectedItems.innerHTML = `
                    <div class="empty-selection">
                        <span>+</span>
                        <p>No services selected yet.</p>
                    </div>
                `;

            }


            if (totalPrice) {

                totalPrice.textContent =
                    "₹0";

            }


            return;

        }


        /* -----------------------------------------------------
           SELECTED ITEMS
        ----------------------------------------------------- */

        if (selectedItems) {

            selectedItems.innerHTML =
                "";


            selectedServices.forEach(
                (service) => {

                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        "selected-item";


                    const name =
                        document.createElement(
                            "span"
                        );


                    name.className =
                        "selected-item-name";


                    name.textContent =
                        service.name;


                    const price =
                        document.createElement(
                            "span"
                        );


                    price.className =
                        "selected-item-price";


                    price.textContent =
                        service.price > 0
                            ? formatPrice(
                                service.price
                            )
                            : "Custom quote";


                    item.appendChild(
                        name
                    );


                    item.appendChild(
                        price
                    );


                    selectedItems.appendChild(
                        item
                    );

                }
            );

        }


        /* -----------------------------------------------------
           TOTAL
        ----------------------------------------------------- */

        const total =
            selectedServices.reduce(
                (sum, service) =>
                    sum + service.price,
                0
            );


        if (totalPrice) {

            totalPrice.textContent =
                total > 0
                    ? formatPrice(total)
                    : "Custom quote";

        }

    }


    /* =========================================================
       CORE PACKAGE SELECT
    ========================================================= */

    packageButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const packageName =
                        button.dataset.package ||
                        "H&N Package";


                    const isCustom =
                        packageName ===
                        "H&N Custom Project";


                    /* CUSTOM PROJECT */

                    if (isCustom) {

                        clearSelectedPackage();

                        clearIndividualServices();

                        vipSelected =
                            false;

                        setVipButtonState(
                            false
                        );


                        selectedPackage = {

                            name:
                                "H&N Custom Project",

                            price:
                                0

                        };


                        setPackageButtonState(
                            button,
                            true
                        );


                        updatePackage();


                        document
                            .getElementById(
                                "booking"
                            )
                            ?.scrollIntoView({
                                behavior:
                                    "smooth",

                                block:
                                    "start"
                            });


                        return;

                    }


                    /* TOGGLE CURRENT PACKAGE */

                    const alreadySelected =
                        selectedPackage &&
                        selectedPackage.button ===
                            button;


                    if (alreadySelected) {

                        clearSelectedPackage();

                        updatePackage();

                        return;

                    }


                    /* SELECT NEW PACKAGE */

                    clearSelectedPackage();

                    clearIndividualServices();

                    vipSelected =
                        false;

                    setVipButtonState(
                        false
                    );


                    selectedPackage = {

                        name:
                            packageName,

                        price:
                            getPackagePrice(
                                packageName
                            ),

                        button:
                            button

                    };


                    setPackageButtonState(
                        button,
                        true
                    );


                    updatePackage();

                }
            );

        }
    );


    /* =========================================================
       INDIVIDUAL SERVICE CHECKBOXES
    ========================================================= */

    priceCheckboxes.forEach(
        (checkbox) => {

            checkbox.addEventListener(
                "change",
                () => {

                    if (
                        checkbox.checked
                    ) {

                        clearSelectedPackage();

                        vipSelected =
                            false;

                        setVipButtonState(
                            false
                        );

                    }


                    updatePackage();

                }
            );

        }
    );


    /* =========================================================
       VIP PACKAGE
    ========================================================= */

    vipSelect?.addEventListener(
        "click",
        () => {

            const willSelect =
                !vipSelected;


            if (willSelect) {

                clearSelectedPackage();

                clearIndividualServices();

            }


            vipSelected =
                willSelect;


            setVipButtonState(
                vipSelected
            );


            updatePackage();

        }
    );


    /* =========================================================
       CLEAR ALL
    ========================================================= */

    clearSelection?.addEventListener(
        "click",
        () => {

            clearSelectedPackage();

            clearIndividualServices();

            vipSelected =
                false;


            setVipButtonState(
                false
            );


            updatePackage();

        }
    );


    /* =========================================================
       GO TO BOOKING
    ========================================================= */

    function goToBooking() {

        const booking =
            document.getElementById(
                "booking"
            );


        if (!booking) {
            return;
        }


        booking.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    /* =========================================================
       CONTINUE TO BOOKING
    ========================================================= */

    continueBooking?.addEventListener(
        "click",
        () => {

            if (
                selectedServices.length === 0
            ) {

                alert(
                    "Please select at least one service or package."
                );


                return;

            }


            goToBooking();

        }
    );


    /* =========================================================
       CUSTOM PROJECT CTA
    ========================================================= */

    customProjectButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    clearSelectedPackage();

                    clearIndividualServices();

                    vipSelected =
                        false;


                    setVipButtonState(
                        false
                    );


                    selectedPackage = {

                        name:
                            "H&N Custom Project",

                        price:
                            0,

                        button:
                            null

                    };


                    updatePackage();

                    goToBooking();

                }
            );

        }
    );


    /* =========================================================
       INITIAL PACKAGE STATE
    ========================================================= */

    packageButtons.forEach(
        (button) => {

            setPackageButtonState(
                button,
                false
            );

        }
    );


    setVipButtonState(false);

    updatePackage();


    /* =========================================================
       DATE PICKER — FULL FIELD CLICK
    ========================================================= */

    const dateFields =
        document.querySelectorAll(
            ".date-field"
        );


    dateFields.forEach(
        (field) => {

            const input =
                field.querySelector(
                    ".date-input"
                );


            if (!input) {
                return;
            }


            function openDatePicker() {

                input.focus({
                    preventScroll: true
                });


                if (
                    typeof input.showPicker ===
                    "function"
                ) {

                    try {

                        input.showPicker();

                    } catch (error) {

                        /*
                         Native picker unavailable
                         or already open.
                        */

                    }

                }

            }


            /* =================================================
               CLICK LABEL / OUTER FIELD
            ================================================= */

            field.addEventListener(
                "click",
                (event) => {

                    if (
                        event.target !== input
                    ) {

                        openDatePicker();

                    }

                }
            );


            /* =================================================
               CLICK ACTUAL DATE INPUT
               INCLUDING CALENDAR ICON
            ================================================= */

            input.addEventListener(
                "click",
                (event) => {

                    if (
                        typeof input.showPicker ===
                        "function"
                    ) {

                        event.preventDefault();

                        openDatePicker();

                    }

                }
            );

        }
    );


    /* =========================================================
       DATE VALIDATION
    ========================================================= */

    const startDateInput =
        document.querySelector(
            'input[name="startDate"]'
        );


    const endDateInput =
        document.querySelector(
            'input[name="endDate"]'
        );


    startDateInput?.addEventListener(
        "change",
        () => {

            if (
                !startDateInput.value
            ) {

                return;

            }


            if (endDateInput) {

                endDateInput.min =
                    startDateInput.value;


                if (
                    endDateInput.value &&
                    endDateInput.value <
                        startDateInput.value
                ) {

                    endDateInput.value =
                        "";

                }

            }

        }
    );


    /* =========================================================
       BOOKING FORM → WHATSAPP
    ========================================================= */

    const bookingForm =
        document.getElementById(
            "bookingForm"
        );


    const bookingResult =
        document.getElementById(
            "bookingResult"
        );


    bookingForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            /* CHECK SELECTION */

            if (
                selectedServices.length === 0
            ) {

                alert(
                    "Please select at least one service or package before booking."
                );


                return;

            }


            /* FORM DATA */

            const data =
                new FormData(
                    bookingForm
                );


            const name =
                data.get("name") ||
                "Not provided";


            const phone =
                data.get("phone") ||
                "Not provided";


            const email =
                data.get("email") ||
                "Not provided";


            const eventType =
                data.get("eventType") ||
                "Not specified";


            const startDate =
                data.get("startDate") ||
                "Not provided";


            const endDate =
                data.get("endDate") ||
                "Not provided";


            const location =
                data.get("location") ||
                "Not provided";


            const hours =
                data.get("hours") ||
                "Not specified";


            const people =
                data.get("people") ||
                "Not specified";


            const requirements =
                data.get("requirements") ||
                "No additional requirements provided.";


            /* TOTAL */

            const total =
                selectedServices.reduce(
                    (sum, service) =>
                        sum + service.price,
                    0
                );


            /* SELECTED SERVICES */

            const packageText =
                selectedServices
                    .map(
                        (service) => {

                            const priceText =
                                service.price > 0
                                    ? formatPrice(
                                        service.price
                                    )
                                    : "Custom quote";


                            return (
                                `• ${service.name} — ${priceText}`
                            );

                        }
                    )
                    .join("\n");


            /* TOTAL TEXT */

            const totalText =
                total > 0
                    ? formatPrice(total)
                    : "Custom quote";


            /* =================================================
               WHATSAPP MESSAGE
            ================================================= */

            const message =
`*H&N STUDIO — BOOKING REQUEST*
━━━━━━━━━━━━━━━━━━━━

*CLIENT DETAILS*

Name:
${name}

Phone / WhatsApp:
${phone}

Email:
${email}

*PROJECT DETAILS*

Event Type:
${eventType}

Start Date:
${startDate}

End Date:
${endDate}

Location:
${location}

Approx. Hours:
${hours}

Approx. People:
${people}

*SELECTED SERVICES / PACKAGES*

${packageText}

*ESTIMATED TOTAL*

${totalText}

*ADDITIONAL REQUIREMENTS*

${requirements}

━━━━━━━━━━━━━━━━━━━━

Please confirm availability,
final pricing and booking requirements.

Thank you,
H&N Studio`;


            /* =================================================
               WHATSAPP CONTACT OPTIONS
            ================================================= */

            const whatsappContacts = [

                {
                    label: "WhatsApp — 01",
                    display: "+91 96203 13839",
                    number: "919620313839"
                },

                {
                    label: "WhatsApp — 02",
                    display: "+91 95351 95219",
                    number: "919535195219"
                }

            ];


            /* =================================================
               BUILD WHATSAPP LINKS
            ================================================= */

            const whatsappLinks =
                whatsappContacts
                    .map((contact) => {

                        const whatsappURL =
                            `https://wa.me/${contact.number}?text=${encodeURIComponent(
                                message
                            )}`;

                        return `
                            <a
                                class="booking-whatsapp-option"
                                href="${whatsappURL}"
                                target="_blank"
                                rel="noopener"
                            >
                                <span>
                                    <strong>${contact.label}</strong>
                                    <small>${contact.display}</small>
                                </span>
                                <b>OPEN ↗</b>
                            </a>
                        `;

                    })
                    .join("");


            /* =================================================
               SHOW RESULT
            ================================================= */

            if (bookingResult) {

                bookingResult.innerHTML = `
                    <div class="booking-result-title">
                        Booking request prepared.
                    </div>

                    <p class="booking-result-text">
                        Choose either H&N WhatsApp number below to send your
                        complete booking request.
                    </p>

                    <div class="booking-whatsapp-options">
                        ${whatsappLinks}
                    </div>
                `;

                bookingResult.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest"
                });

            }

        }
    );


    /* =========================================================
       ESCAPE KEY → CLOSE MOBILE MENU
    ========================================================= */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                nav?.classList.contains(
                    "mobile-open"
                )
            ) {

                nav.classList.remove(
                    "mobile-open"
                );


                menu?.setAttribute(
                    "aria-expanded",
                    "false"
                );


                if (menu) {
                    menu.textContent = "☰";
                }

            }

        }
    );


    /* =========================================================
       HEADER LOGO / TOP LINK
    ========================================================= */

    const topLinks =
        document.querySelectorAll(
            'a[href="#top"], a[href="#home"], .logo-link'
        );


    topLinks.forEach(
        (link) => {

            link.addEventListener(
                "click",
                (event) => {

                    const target =
                        document.getElementById(
                            "top"
                        ) ||
                        document.getElementById(
                            "home"
                        );


                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                }
            );

        }
    );

});