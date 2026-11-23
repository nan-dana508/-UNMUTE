
document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. SELECT PAGE ELEMENTS
    // ==========================================

    const cancerFilter = document.getElementById("cancerFilter");
    const ageFilter = document.getElementById("ageFilter");
    const resetButton = document.getElementById("resetFilters");

    const storyCards = document.querySelectorAll(".story-card");
    const resultCount = document.getElementById("storyResultCount");
    const emptyMessage = document.getElementById("storyEmpty");

    const totalStories = storyCards.length;


    // ==========================================
    // 2. AGE GROUP FILTERING
    // ==========================================

    function matchesAgeGroup(age, ageGroup) {

        switch (ageGroup) {

            case "under20":
                return age < 20;

            case "20-39":
                return age >= 20 && age <= 39;

            case "40-59":
                return age >= 40 && age <= 59;

            case "60plus":
                return age >= 60;

            case "all":
            default:
                return true;
        }
    }


    // ==========================================
    // 3. FILTER SURVIVOR STORIES
    // ==========================================

    function filterStories() {

        const selectedCancer = cancerFilter.value;
        const selectedAge = ageFilter.value;

        let visibleStories = 0;

        storyCards.forEach(card => {

            const cancerType = card.dataset.cancer;
            const age = Number(card.dataset.age);

            const cancerMatches =
                selectedCancer === "all" ||
                cancerType === selectedCancer;

            const ageMatches =
                matchesAgeGroup(age, selectedAge);

            const shouldDisplay = cancerMatches && ageMatches;

            card.hidden = !shouldDisplay;

            if (shouldDisplay) {
                visibleStories++;
            } else {
                // Close a flipped card when it becomes hidden.
                setCardFlipped(card, false);
            }

        });


        // Update the result count.

        resultCount.textContent =
            `Showing ${visibleStories} of ${totalStories} survivor stories`;


        // Show or hide the empty state.

        emptyMessage.classList.toggle(
            "is-visible",
            visibleStories === 0
        );

        emptyMessage.hidden = visibleStories !== 0;

    }


    // ==========================================
    // 4. FLIP CARD ACCESSIBILITY
    // ==========================================

    function setCardFlipped(card, isFlipped) {

        const front = card.querySelector(".story-card-front");
        const back = card.querySelector(".story-card-back");
        const flipButton = card.querySelector(".story-flip-button");

        if (!front || !back) return;

        card.classList.toggle("is-flipped", isFlipped);

        // Only the visible face should be accessible.

        front.setAttribute("aria-hidden", String(isFlipped));
        back.setAttribute("aria-hidden", String(!isFlipped));

        front.inert = isFlipped;
        back.inert = !isFlipped;

        if (flipButton) {
            flipButton.setAttribute(
                "aria-expanded",
                String(isFlipped)
            );
        }

    }


    // ==========================================
    // 5. OPEN AND CLOSE STORY CARDS
    // ==========================================

    storyCards.forEach(card => {

        const flipButton = card.querySelector(".story-flip-button");
        const backButton = card.querySelector(".story-back-button");

        if (flipButton) {

            flipButton.addEventListener("click", () => {
                setCardFlipped(card, true);
            });

        }

        if (backButton) {

            backButton.addEventListener("click", () => {
                setCardFlipped(card, false);
            });

        }

    });


    // ==========================================
    // 6. FILTER EVENT LISTENERS
    // ==========================================

    cancerFilter.addEventListener("change", filterStories);
    ageFilter.addEventListener("change", filterStories);


    // ==========================================
    // 7. RESET FILTERS
    // ==========================================

    resetButton.addEventListener("click", () => {

        cancerFilter.value = "all";
        ageFilter.value = "all";

        filterStories();

    });


    // ==========================================
    // 8. INITIAL PAGE STATE
    // ==========================================

    storyCards.forEach(card => {
        setCardFlipped(card, false);
    });

    filterStories();

});
