import { FamilyModel } from "./model.js";
import { FamilyView } from "./view.js";

// FAMILY CONTROLLER CLASS
class FamilyController {

    constructor() {
        // Initialize Model and View
        this.model = new FamilyModel();
        this.view = new FamilyView();

        // Get HTML elements
        this.searchInput =
            document.getElementById("searchInput");

        this.generationFilter =
            document.getElementById("generationFilter");

        this.resetBtn =
            document.getElementById("resetBtn");

        this.closeModalBtn =
            document.getElementById("closeModal");

        this.profileModal =
            document.getElementById("profileModal");

        // Store previously focused element
        this.previousFocus = null;
    }

    // 1. INITIALIZE APPLICATION
    async init() {

        try {
            // Load JSON dataset through Model
            await this.model.loadFamilyData();

            // Display statistics
            const statistics = this.model.getStatistics();

            this.view.renderStatistics(statistics);

            // Display family tree and member cards
            this.renderData();

            // Activate event listeners
            this.setupEventListeners();

            // Display current year
            document.getElementById("currentYear").textContent =
                new Date().getFullYear();

            console.log("Roots & Legacy initialized successfully.");

        } catch (error) {

            console.error("Application error:", error);

            this.view.showError(
                "Unable to load family data. " +
                "Please check family.json and use Live Server."
            );
        }
    }

    // 2. DISPLAY FAMILY DATA
    renderData() {

        const keyword = this.searchInput.value;

        const generation = this.generationFilter.value;

        // Get matching family members
        const members = this.model.getFilteredMembers(
            keyword,
            generation
        );

        // Group by generation
        const groups = this.model.groupByGeneration(members);

        // Update View
        this.view.renderFamilyTree(groups);

        this.view.renderMembers(members);

        console.log("Displaying", members.length, "family members.");
    }

    // 3. OPEN MEMBER PROFILE
    openMemberProfile(id) {

        const member = this.model.getMemberById(id);

        if (!member) {
            console.error("Family member not found:", id);
            return;
        }

        // Get family relationships
        const father = this.model.getFather(member);

        const mother = this.model.getMother(member);

        const spouse = this.model.getSpouse(member);

        const children = this.model.getChildren(member);

        // Remember current focus
        this.previousFocus = document.activeElement;

        // Display profile through View
        this.view.showProfile(
            member,
            father,
            mother,
            spouse,
            children
        );
    }

    // 4. CLOSE MEMBER PROFILE
    closeMemberProfile() {

        this.view.closeProfile();

        // Return focus to previous element
        if (this.previousFocus) {
            this.previousFocus.focus();
        }
    }

    // 5. SET UP EVENT LISTENERS
    setupEventListeners() {

        // SEARCH FAMILY MEMBERS
        this.searchInput.addEventListener("input", () => {
            this.renderData();
        });

        // FILTER BY GENERATION
        this.generationFilter.addEventListener("change", () => {
            this.renderData();
        });

        // RESET SEARCH AND FILTER
        this.resetBtn.addEventListener("click", () => {

            this.searchInput.value = "";

            this.generationFilter.value = "all";

            this.renderData();
        });

        // CLICK FAMILY TREE MEMBER
        document.getElementById("familyTree")
            .addEventListener("click", (event) => {

                const card = event.target.closest(".tree-member");

                if (card) {
                    this.openMemberProfile(card.dataset.id);
                }
            });

        // CLICK FAMILY MEMBER CARD
        document.getElementById("membersGrid")
            .addEventListener("click", (event) => {

                const card = event.target.closest(".member-card");

                if (card) {
                    this.openMemberProfile(card.dataset.id);
                }

            });

        // KEYBOARD ACCESS FOR MEMBER CARDS
        ["familyTree", "membersGrid"].forEach(containerId => {

            document.getElementById(containerId)
                .addEventListener("keydown", (event) => {

                    if (event.key === "Enter" ||
                        event.key === " ") {

                        const card = event.target.closest(
                            ".tree-member, .member-card"
                        );

                        if (card) {

                            event.preventDefault();

                            this.openMemberProfile(card.dataset.id);
                        }
                    }
                });
        });

        // CLOSE MODAL BUTTON
        this.closeModalBtn.addEventListener("click", () => {
            this.closeMemberProfile();
        });

        // CLOSE MODAL BY CLICKING OUTSIDE
        this.profileModal.addEventListener("click", (event) => {

            if (event.target === this.profileModal) {
                this.closeMemberProfile();
            }
        });

        // CLOSE MODAL WITH ESCAPE KEY
        document.addEventListener("keydown", (event) => {

            if (event.key === "Escape" &&
                this.profileModal.classList.contains("active")) {

                this.closeMemberProfile();
            }
        });
    }
}

// START APPLICATION WHEN PAGE IS READY
const app = new FamilyController();

app.init();
