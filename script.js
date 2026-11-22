
 // ============================================
 // UNMUTE - WELCOME POPUP
 // ============================================

const welcomePopup = document.getElementById("welcomePopup");
const heroSection = document.querySelector(".hero");
const exploreButton = document.getElementById("exploreButton");
const welcomeOptions = document.querySelectorAll(".welcome-option");

let welcomePopupShown = false;

function showWelcomePopup() {
    if (!welcomePopup || !heroSection || welcomePopupShown) return;

    if (sessionStorage.getItem("unmuteWelcomeShown")) return;

    welcomePopup.style.display = "flex";
    welcomePopupShown = true;

    sessionStorage.setItem("unmuteWelcomeShown", "true");
}

function hideWelcomePopup() {
    if (welcomePopup) {
        welcomePopup.style.display = "none";
    }
}

function checkWelcomeScroll() {
    if (!heroSection || welcomePopupShown) return;

    if (heroSection.getBoundingClientRect().bottom <= 0) {
        showWelcomePopup();
    }
}

window.addEventListener("scroll", checkWelcomeScroll);

welcomeOptions.forEach(option => {
    option.addEventListener("click", hideWelcomePopup);
});

if (exploreButton) {
    exploreButton.addEventListener("click", event => {
        event.preventDefault();
        hideWelcomePopup();
    });
}


// ============================================
// A LITTLE GARDEN OF HOPE
// ============================================

// Get garden elements

const flowerChoices = document.querySelectorAll(".flower-choice");
const gardenScene = document.getElementById("gardenScene");
const gardenPlant = document.getElementById("gardenPlant");
const wateringTool = document.getElementById("wateringTool");
const waterFlow = document.getElementById("waterFlow");
const gardenInstruction = document.getElementById("gardenInstruction");
const gardenMessage = document.getElementById("gardenMessage");
const restartGarden = document.getElementById("restartGarden");

// Find the garden interaction area for automatic scrolling.

const gardenInteractionArea =
    document.getElementById("gardenContainer") ||
    document.querySelector(".garden-container") ||
    gardenScene;


// ============================================
// GARDEN STATE
// ============================================

let selectedFlower = null;

let growthProgress = 0;

let isDragging = false;
let isHolding = false;
let isWatering = false;

let dragOffsetX = 0;
let dragOffsetY = 0;

let growthInterval = null;

// Faster growth: approximately 3.5 seconds of continuous watering.
const growthDuration = 3500;
const growthStep = 100;


// ============================================
// FLOWER MESSAGES
// ============================================

const flowerMessages = {
    daisy:
        "You don't have to have everything figured out. Every new beginning starts with a little room to grow.",

    sunflower:
        "Even on the cloudiest days, your strength doesn't disappear. It can be quiet, and it can look different every day.",

    tulip:
        "There is no single way forward. May each new chapter bring you moments of possibility and peace.",

    rose:
        "Courage isn't about never feeling afraid. Sometimes, it's simply allowing yourself to be cared for.",

    lavender:
        "You deserve moments of rest, softness and stillness. You don't have to earn the right to pause."
};


// ============================================
// FLOWER ILLUSTRATIONS
// ============================================

function createFlowerHead(flower) {

    if (flower === "daisy") {
        return `
            <g stroke="#D8C9B9" stroke-width="1.3">
                ${Array.from({ length: 12 }, (_, i) => `
                    <ellipse
                        cx="0" cy="-25"
                        rx="8" ry="17"
                        fill="#FFFDF5"
                        transform="rotate(${i * 30})"
                    />
                `).join("")}
            </g>

            <circle cx="0" cy="0" r="13"
                    fill="#E9B94F"
                    stroke="#D69C35"
                    stroke-width="1.5"/>

            <circle cx="0" cy="0" r="7" fill="#F5D477"/>
        `;
    }

    if (flower === "sunflower") {
        return `
            <g stroke="#D69C35" stroke-width="1.3">
                ${Array.from({ length: 16 }, (_, i) => `
                    <ellipse
                        cx="0" cy="-28"
                        rx="8" ry="17"
                        fill="#E9B94F"
                        transform="rotate(${i * 22.5})"
                    />
                `).join("")}
            </g>

            <circle cx="0" cy="0" r="19" fill="#76502F"/>
            <circle cx="0" cy="0" r="14" fill="#493047"/>

            <g fill="#C49A68">
                ${Array.from({ length: 12 }, (_, i) => `
                    <circle
                        cx="${Math.cos(i * Math.PI / 6) * 8}"
                        cy="${Math.sin(i * Math.PI / 6) * 8}"
                        r="1.8"
                    />
                `).join("")}
            </g>
        `;
    }

    if (flower === "tulip") {
        return `
            <path
                d="M0 16
                   C-25 5 -34 -18 -23 -40
                   C-13 -34 -7 -29 0 -48
                   C7 -29 13 -34 23 -40
                   C34 -18 25 5 0 16Z"
                fill="#D98CA5"
                stroke="#B96F89"
                stroke-width="2"
            />

            <path
                d="M0 12 Q-12 -13 0 -46
                   Q12 -13 0 12Z"
                fill="#E8B2C1"
            />

            <path
                d="M-21 -36 Q-15 -10 0 0"
                fill="none"
                stroke="#F4D5DE"
                stroke-width="2"
            />

            <path
                d="M21 -36 Q15 -10 0 0"
                fill="none"
                stroke="#F4D5DE"
                stroke-width="2"
            />
        `;
    }

    if (flower === "rose") {
        return `
            <g stroke="#B96F89" stroke-width="1.7">
                <path
                    d="M0 20
                       C-26 16 -37 -8 -18 -23
                       C-31 -43 -8 -52 3 -34
                       C20 -52 39 -29 20 -15
                       C42 4 18 28 0 20Z"
                    fill="#D98CA5"
                />

                <path
                    d="M-4 12
                       C-24 -2 -13 -25 3 -23
                       C23 -24 25 2 6 15Z"
                    fill="#E9B7C4"
                />

                <path
                    d="M-2 8
                       C-13 -2 -4 -17 8 -12
                       C20 -5 10 10 -2 8Z"
                    fill="#C96F8D"
                />

                <path
                    d="M-4 2 Q2 -8 9 -4"
                    fill="none"
                    stroke="#F6D6E0"
                    stroke-width="2"
                />
            </g>
        `;
    }

    if (flower === "lavender") {
        return `
            <path
                d="M0 27 Q-3 -5 0 -48"
                fill="none"
                stroke="#66856A"
                stroke-width="3"
            />

            ${Array.from({ length: 9 }, (_, i) => `
                <ellipse
                    cx="${i % 2 === 0 ? -7 : 7}"
                    cy="${-8 - i * 8}"
                    rx="6"
                    ry="9"
                    fill="${i % 2 === 0 ? "#A98BBE" : "#C3A7D3"}"
                    stroke="#9475B4"
                    stroke-width="1"
                    transform="rotate(${i % 2 === 0 ? -25 : 25} ${i % 2 === 0 ? -7 : 7} ${-8 - i * 8})"
                />
            `).join("")}
        `;
    }

    return "";
}


// ============================================
// PLANT AT EACH GROWTH STAGE
// THREE STAGES: SEED → SPROUT → BLOOM
// ============================================

function createPlantSVG(stage, flower) {

    const flowerHead = createFlowerHead(flower);

    // Stage 1: Seed
    if (stage === "seed") {
        return `
            <svg viewBox="0 0 220 240"
                 width="100%" height="100%"
                 xmlns="http://www.w3.org/2000/svg">

                <ellipse cx="110" cy="211"
                         rx="25" ry="10"
                         fill="#8A6449"/>

                <ellipse cx="110" cy="207"
                         rx="9" ry="13"
                         fill="#765036"
                         transform="rotate(25 110 207)"/>

                <path d="M110 216 Q105 224 110 229"
                      stroke="#E4C29B"
                      stroke-width="2"
                      fill="none"/>
            </svg>
        `;
    }

    // Stage 2: Growing sprout
    if (stage === "sprout") {
        return `
            <svg viewBox="0 0 220 240"
                 width="100%" height="100%"
                 xmlns="http://www.w3.org/2000/svg">

                <path
                    d="M110 215 Q110 165 110 105"
                    stroke="#66856A"
                    stroke-width="7"
                    fill="none"
                    stroke-linecap="round"
                />

                <path
                    d="M110 190
                       C76 181 65 151 79 139
                       C102 143 119 163 110 190Z"
                    fill="#9CAF91"
                    stroke="#66856A"
                    stroke-width="1.5"
                />

                <path
                    d="M110 160
                       C133 132 158 131 171 141
                       C162 164 137 176 110 160Z"
                    fill="#7F9A79"
                    stroke="#66856A"
                    stroke-width="1.5"
                />

                <path
                    d="M110 215 Q110 165 110 105"
                    stroke="#66856A"
                    stroke-width="1.5"
                    fill="none"
                />

                <circle cx="110" cy="105"
                        r="9" fill="#A6B49A"/>

                <ellipse cx="110" cy="216"
                         rx="25" ry="8"
                         fill="#8A6449"/>
            </svg>
        `;
    }

    // Stage 3: Fully bloomed flower
    return `
        <svg viewBox="0 0 220 240"
             width="100%" height="100%"
             xmlns="http://www.w3.org/2000/svg">

            <path
                d="M110 215 Q107 150 110 65"
                stroke="#66856A"
                stroke-width="7"
                fill="none"
                stroke-linecap="round"
            />

            <path
                d="M109 180
                   C68 174 57 139 66 128
                   C96 130 113 151 109 180Z"
                fill="#9CAF91"
                stroke="#66856A"
                stroke-width="1.5"
            />

            <path
                d="M109 180 Q87 155 70 134"
                fill="none"
                stroke="#66856A"
                stroke-width="1.5"
            />

            <path
                d="M110 151
                   C135 115 165 116 176 126
                   C169 155 139 167 110 151Z"
                fill="#7F9A79"
                stroke="#66856A"
                stroke-width="1.5"
            />

            <path
                d="M112 150 Q142 133 171 129"
                fill="none"
                stroke="#66856A"
                stroke-width="1.5"
            />

            <g transform="translate(110 65)">
                ${flowerHead}
            </g>

            <ellipse cx="110" cy="216"
                     rx="25" ry="8"
                     fill="#8A6449"/>
        </svg>
    `;
}


// ============================================
// UPDATE GROWTH STAGE
// ============================================

function updateGardenGrowth() {

    let stage;

    if (growthProgress < 0.33) {
        stage = "seed";
    } else if (growthProgress < 1) {
        stage = "sprout";
    } else {
        stage = "bloom";
    }

    gardenPlant.innerHTML =
        createPlantSVG(stage, selectedFlower);

    if (growthProgress >= 1) {
        finishBlooming();
    }
}


// ============================================
// WATERING CAN POSITION
// ============================================

function positionWateringCan() {

    if (!gardenScene || !wateringTool) return;

    const sceneWidth = gardenScene.clientWidth;

    wateringTool.classList.remove("returning");

    wateringTool.style.left =
        Math.max(0, sceneWidth * 0.10) + "px";

    wateringTool.style.top = "";
    wateringTool.style.bottom = "5px";
}


// ============================================
// CHECK WATERING POSITION
// ============================================

function isCanAbovePlant() {

    if (!gardenScene || !wateringTool || !gardenPlant) {
        return false;
    }

    const sceneRect = gardenScene.getBoundingClientRect();
    const canRect = wateringTool.getBoundingClientRect();
    const plantRect = gardenPlant.getBoundingClientRect();

    // Sprinkler opening on the vintage watering can SVG.
    const spoutX =
        canRect.left - sceneRect.left + canRect.width * 0.90;

    const spoutY =
        canRect.top - sceneRect.top + canRect.height * 0.36;

    const plantX =
        plantRect.left - sceneRect.left + plantRect.width / 2;

    const plantY =
        plantRect.top - sceneRect.top + plantRect.height * 0.50;

    return (
        Math.abs(spoutX - plantX) < 145 &&
        spoutY > plantY - 200 &&
        spoutY < plantY + 100
    );
}


// ============================================
// WATER DROPLET ANIMATION
// NO WATER STREAM OR LINE
// ============================================

function showWaterFlow() {

    if (!waterFlow || !wateringTool || !gardenScene) return;

    const sceneRect = gardenScene.getBoundingClientRect();
    const canRect = wateringTool.getBoundingClientRect();

    // Position droplets directly below the sprinkler head.
    const spoutX =
        canRect.left - sceneRect.left + canRect.width * 0.90;

    const spoutY =
        canRect.top - sceneRect.top + canRect.height * 0.38;

    waterFlow.style.left = (spoutX - 12) + "px";
    waterFlow.style.top = spoutY + "px";

    // Create droplets only once, so their animation does not restart
    // every time the watering can moves.
    if (!waterFlow.children.length) {

        waterFlow.innerHTML = `
            <span class="garden-water-drop"
                  style="left: 2px; animation-delay: 0s;"></span>

            <span class="garden-water-drop"
                  style="left: 12px; animation-delay: 0.18s;"></span>

            <span class="garden-water-drop"
                  style="left: 22px; animation-delay: 0.36s;"></span>

            <span class="garden-water-drop"
                  style="left: 7px; animation-delay: 0.54s;"></span>

            <span class="garden-water-drop"
                  style="left: 18px; animation-delay: 0.72s;"></span>
        `;
    }

    waterFlow.classList.add("is-active");
}


function hideWaterFlow() {

    if (!waterFlow) return;

    waterFlow.classList.remove("is-active");
    waterFlow.style.display = "none";
    waterFlow.innerHTML = "";
}


// ============================================
// START AND STOP WATERING
// ============================================

function startWatering() {

    if (
        !selectedFlower ||
        growthProgress >= 1 ||
        !isHolding ||
        !isCanAbovePlant() ||
        isWatering
    ) {
        return;
    }

    isWatering = true;

    if (waterFlow) {
        waterFlow.style.display = "block";
    }

    showWaterFlow();

    if (gardenInstruction) {
        gardenInstruction.textContent =
            "Your flower is growing. Keep holding to water it...";
    }

    growthInterval = setInterval(() => {

        if (
            !isHolding ||
            !isCanAbovePlant() ||
            growthProgress >= 1
        ) {
            stopWatering();
            return;
        }

        growthProgress += growthStep / growthDuration;

        if (growthProgress > 1) {
            growthProgress = 1;
        }

        updateGardenGrowth();

    }, growthStep);
}


function stopWatering() {

    isWatering = false;

    if (growthInterval) {
        clearInterval(growthInterval);
        growthInterval = null;
    }

    hideWaterFlow();
}


// ============================================
// CHECK WATERING STATE
// ============================================

function updateWateringState() {

    if (
        isHolding &&
        selectedFlower &&
        growthProgress < 1 &&
        isCanAbovePlant()
    ) {
        startWatering();

    } else if (isWatering) {

        stopWatering();

        if (gardenInstruction && growthProgress < 1) {
            gardenInstruction.textContent =
                "Move the watering can above your flower to continue.";
        }
    }
}


// ============================================
// FLOWER SELECTION
// ============================================

flowerChoices.forEach(choice => {

    choice.addEventListener("click", () => {

        const flower = choice.dataset.flower;

        if (!flower || !gardenPlant) return;

        stopWatering();

        isHolding = false;
        isDragging = false;

        selectedFlower = flower;
        growthProgress = 0;

        flowerChoices.forEach(item => {
            item.classList.remove("selected");
            item.setAttribute("aria-pressed", "false");
        });

        choice.classList.add("selected");
        choice.setAttribute("aria-pressed", "true");

        gardenPlant.innerHTML =
            createPlantSVG("seed", selectedFlower);

        gardenPlant.style.display = "flex";

        if (gardenMessage) {
            gardenMessage.textContent = "";
            gardenMessage.style.display = "none";
            gardenMessage.hidden = true;
        }

        if (restartGarden) {
            restartGarden.style.display = "none";
            restartGarden.hidden = true;
        }

        if (wateringTool) {

            wateringTool.style.display = "flex";

            requestAnimationFrame(() => {
                positionWateringCan();
            });
        }

        if (gardenInstruction) {
            gardenInstruction.textContent =
                "Drag the watering can above your seed. Press and hold to water.";
        }

        // Automatically scroll to the garden after flower selection.
        if (gardenInteractionArea) {
            requestAnimationFrame(() => {
                gardenInteractionArea.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            });
        }
    });
});


// ============================================
// RETURN WATERING CAN TO ITS ORIGINAL POSITION
// ============================================

function returnWateringCanHome() {

    if (!wateringTool || !gardenScene) return;

    stopWatering();

    wateringTool.classList.remove("returning");

    const sceneRect = gardenScene.getBoundingClientRect();
    const canRect = wateringTool.getBoundingClientRect();

    const currentLeft = canRect.left - sceneRect.left;
    const currentTop = canRect.top - sceneRect.top;

    const targetLeft = Math.max(0, sceneRect.width * 0.10);
    const targetTop = sceneRect.height - canRect.height - 5;

    // Convert the can from bottom positioning to top positioning
    // so both coordinates can animate smoothly.
    wateringTool.style.bottom = "auto";
    wateringTool.style.left = currentLeft + "px";
    wateringTool.style.top = currentTop + "px";

    // Allow the browser to register the starting position first.
    requestAnimationFrame(() => {

        wateringTool.classList.add("returning");

        wateringTool.style.left = targetLeft + "px";
        wateringTool.style.top = targetTop + "px";

        // Restore the original CSS positioning after the animation.
        setTimeout(() => {

            wateringTool.classList.remove("returning");

            wateringTool.style.left = targetLeft + "px";
            wateringTool.style.top = "";
            wateringTool.style.bottom = "5px";

        }, 700);
    });
}


// ============================================
// DRAGGABLE WATERING CAN
// MOUSE AND TOUCH
// ============================================

if (wateringTool && gardenScene) {

    wateringTool.addEventListener("pointerdown", event => {

        if (!selectedFlower || growthProgress >= 1) return;

        event.preventDefault();

        wateringTool.classList.remove("returning");

        isDragging = true;
        isHolding = true;

        const canRect = wateringTool.getBoundingClientRect();

        dragOffsetX = event.clientX - canRect.left;
        dragOffsetY = event.clientY - canRect.top;

        wateringTool.style.cursor = "grabbing";

        wateringTool.setPointerCapture(event.pointerId);

        updateWateringState();
    });


    wateringTool.addEventListener("pointermove", event => {

        if (!isDragging) return;

        event.preventDefault();

        const sceneRect = gardenScene.getBoundingClientRect();

        const canWidth = wateringTool.offsetWidth;
        const canHeight = wateringTool.offsetHeight;

        let newLeft =
            event.clientX - sceneRect.left - dragOffsetX;

        let newTop =
            event.clientY - sceneRect.top - dragOffsetY;

        newLeft = Math.max(
            0,
            Math.min(newLeft, sceneRect.width - canWidth)
        );

        newTop = Math.max(
            0,
            Math.min(newTop, sceneRect.height - canHeight)
        );

        wateringTool.style.left = newLeft + "px";
        wateringTool.style.top = newTop + "px";
        wateringTool.style.bottom = "auto";

        updateWateringState();

        if (isWatering) {
            showWaterFlow();
        }
    });


    function endDragging() {

        if (!isDragging) return;

        isDragging = false;
        isHolding = false;

        wateringTool.style.cursor = "grab";

        stopWatering();

        if (selectedFlower && growthProgress < 1 && gardenInstruction) {
            gardenInstruction.textContent =
                "Press and hold the watering can above your flower to continue.";
        }
    }


    wateringTool.addEventListener("pointerup", endDragging);
    wateringTool.addEventListener("pointercancel", endDragging);
    wateringTool.addEventListener("lostpointercapture", endDragging);
}


// ============================================
// FLOWER FULLY BLOOMS
// ============================================

function finishBlooming() {

    if (growthProgress >= 1 && !isWatering && !isHolding) {
        // Prevent duplicate completion.
        if (gardenMessage && !gardenMessage.hidden) return;
    }

    stopWatering();

    growthProgress = 1;
    isHolding = false;
    isDragging = false;

    gardenPlant.innerHTML =
        createPlantSVG("bloom", selectedFlower);

    // Keep the vintage watering can visible.
    // Smoothly return it to its original position.
    if (wateringTool) {
        wateringTool.style.display = "flex";
        wateringTool.style.cursor = "grab";

        returnWateringCanHome();
    }

    if (gardenInstruction) {
        gardenInstruction.textContent =
            "Your flower has bloomed.";
    }

    if (gardenMessage) {
        gardenMessage.textContent =
            flowerMessages[selectedFlower];

        gardenMessage.hidden = false;
        gardenMessage.style.display = "block";
    }

    if (restartGarden) {
        restartGarden.hidden = false;
        restartGarden.style.display = "inline-block";
    }
}


// ============================================
// RESTART GARDEN
// ============================================

if (restartGarden) {

    restartGarden.addEventListener("click", () => {

        stopWatering();

        selectedFlower = null;
        growthProgress = 0;
        isDragging = false;
        isHolding = false;

        flowerChoices.forEach(choice => {
            choice.classList.remove("selected");
            choice.setAttribute("aria-pressed", "false");
        });

        if (gardenPlant) {
            gardenPlant.innerHTML = "";
            gardenPlant.style.display = "none";
        }

        if (wateringTool) {
            wateringTool.classList.remove("returning");
            wateringTool.style.display = "none";
            wateringTool.style.top = "";
            wateringTool.style.left = "";
            wateringTool.style.bottom = "5px";
        }

        if (gardenMessage) {
            gardenMessage.textContent = "";
            gardenMessage.hidden = true;
            gardenMessage.style.display = "none";
        }

        if (restartGarden) {
            restartGarden.hidden = true;
            restartGarden.style.display = "none";
        }

        if (gardenInstruction) {
            gardenInstruction.textContent =
                "Choose a flower to begin your garden.";
        }

        // Smoothly scroll back to the flower selection gallery.
        if (flowerChoices.length > 0) {
            requestAnimationFrame(() => {
                flowerChoices[0].scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            });
        }
    });
}


// ============================================
// INITIAL SETUP
// ============================================

if (wateringTool) {
    wateringTool.style.display = "none";
}

if (gardenPlant) {
    gardenPlant.style.display = "none";
}

if (waterFlow) {
    waterFlow.style.display = "none";
    waterFlow.classList.remove("is-active");
}

if (gardenMessage) {
    gardenMessage.hidden = true;
    gardenMessage.style.display = "none";
}

if (restartGarden) {
    restartGarden.hidden = true;
    restartGarden.style.display = "none";
}


// ============================================
// RESPONSIVE WATERING CAN POSITION
// ============================================

window.addEventListener("resize", () => {

    if (
        wateringTool &&
        wateringTool.style.display !== "none" &&
        !isDragging &&
        growthProgress < 1
    ) {
        positionWateringCan();
    }
});
