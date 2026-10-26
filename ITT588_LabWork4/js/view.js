export class FamilyView {
    constructor() {

        this.familyTree =
            document.getElementById("familyTree");

        this.membersGrid =
            document.getElementById("membersGrid");

        this.profileModal =
            document.getElementById("profileModal");

        this.profileName =
            document.getElementById("profileName");

        this.profileAvatar =
            document.getElementById("profileAvatar");

        this.profileGeneration =
            document.getElementById("profileGeneration");

        this.profileDetails =
            document.getElementById("profileDetails");

        this.profileRelationships =
            document.getElementById("profileRelationships");
    }

    // 1. DISPLAY FAMILY STATISTICS
    renderStatistics(statistics) {

        document.getElementById("totalMembers").textContent =
            statistics.totalMembers;

        document.getElementById("totalGenerations").textContent =
            statistics.totalGenerations;

        document.getElementById("totalFamilies").textContent =
            statistics.totalFamilies;
    }

    // 2. GET AVATAR BASED ON GENDER
    getAvatar(gender) {

        if (gender === "Male") {
            return "👨";
        }

        if (gender === "Female") {
            return "👩";
        }

        return "👤";
    }

// 3. DISPLAY FAMILY TREE WITH CONNECTIONS
renderFamilyTree(groups) {

    this.familyTree.innerHTML = "";

    const generations = Object.keys(groups)
        .sort((a, b) => Number(a) - Number(b));

    if (generations.length === 0) {
        this.familyTree.textContent =
            "No family members found.";
        return;
    }

    generations.forEach((generation, index) => {

        const group = document.createElement("div");
        group.className = "generation-group";

        const title = document.createElement("h3");
        title.className = "generation-title";
        title.textContent = `Generation ${generation}`;

        const membersContainer =
            document.createElement("div");

        membersContainer.className =
            "generation-members";

        groups[generation].forEach(member => {

            const card = document.createElement("div");

            card.className = "tree-member";
            card.dataset.id = member.id;
            card.tabIndex = 0;
            card.setAttribute("role", "button");

            const avatar = document.createElement("div");
            avatar.className = "member-avatar";
            avatar.textContent =
                this.getAvatar(member.gender);

            const name = document.createElement("h4");
            name.textContent = member.name;

            const occupation = document.createElement("p");
            occupation.textContent = member.occupation;

            card.appendChild(avatar);
            card.appendChild(name);
            card.appendChild(occupation);

            membersContainer.appendChild(card);

        });

        group.appendChild(title);
        group.appendChild(membersContainer);

        this.familyTree.appendChild(group);

        // Add visual connection between generations
        if (index < generations.length - 1) {

            const connector = document.createElement("div");
            connector.className = "generation-connector";

            const line = document.createElement("div");
            line.className = "connector-line";

            connector.appendChild(line);
            this.familyTree.appendChild(connector);
        }
    });
}

    // 4. DISPLAY FAMILY MEMBER CARDS
    renderMembers(members) {

        this.membersGrid.innerHTML = "";

        if (members.length === 0) {

            this.membersGrid.innerHTML =
                "<p>No matching family members found.</p>";

            return;
        }

        members.forEach(member => {

            const card = document.createElement("div");

            card.className = "member-card";
            card.dataset.id = member.id;
            card.tabIndex = 0;
            card.setAttribute("role", "button");

            const avatar = document.createElement("div");
            avatar.className = "member-avatar";
            avatar.textContent = this.getAvatar(member.gender);

            const name = document.createElement("h3");
            name.textContent = member.name;

            const generation = document.createElement("p");
            generation.textContent =
                `Generation ${member.generation}`;

            const occupation = document.createElement("p");
            occupation.textContent = member.occupation;

            card.appendChild(avatar);
            card.appendChild(name);
            card.appendChild(generation);
            card.appendChild(occupation);

            this.membersGrid.appendChild(card);
        });
    }

    // 5. DISPLAY FAMILY MEMBER PROFILE
    showProfile(member, father, mother, spouse, children) {

        this.profileName.textContent = member.name;

        this.profileAvatar.textContent =
            this.getAvatar(member.gender);

        this.profileGeneration.textContent =
            `Generation ${member.generation}`;

        this.profileDetails.innerHTML = "";

        const details = [
            ["Gender", member.gender],
            ["Date of Birth", member.birthDate],
            ["Birthplace", member.birthPlace],
            ["Occupation", member.occupation],
            ["Biography", member.bio]
        ];

        details.forEach(([label, value]) => {

            const paragraph = document.createElement("p");

            const strong = document.createElement("strong");
            strong.textContent = `${label}: `;

            paragraph.appendChild(strong);

            paragraph.appendChild(
                document.createTextNode(value || "Not available")
            );

            this.profileDetails.appendChild(paragraph);
        });

        // DISPLAY RELATIONSHIPS
        this.profileRelationships.innerHTML = "";

        const heading = document.createElement("h3");
        heading.textContent = "Family Relationships";

        this.profileRelationships.appendChild(heading);

        const relationships = [
            ["Father", father ? father.name : "Not recorded"],
            ["Mother", mother ? mother.name : "Not recorded"],
            ["Spouse", spouse ? spouse.name : "Not recorded"],
            [
                "Children",
                children.length > 0
                    ? children.map(child => child.name).join(", ")
                    : "None recorded"
            ]
        ];

        relationships.forEach(([label, value]) => {

            const paragraph = document.createElement("p");

            const strong = document.createElement("strong");
            strong.textContent = `${label}: `;

            paragraph.appendChild(strong);

            paragraph.appendChild(
                document.createTextNode(value)
            );

            this.profileRelationships.appendChild(paragraph);
        });

        // OPEN MODAL
        this.profileModal.classList.add("active");

        this.profileModal.setAttribute(
            "aria-hidden", "false"
        );

        document.body.style.overflow = "hidden";

        document.getElementById("closeModal").focus();
    }

    // 6. CLOSE FAMILY MEMBER PROFILE
    closeProfile() {

        this.profileModal.classList.remove("active");

        this.profileModal.setAttribute(
            "aria-hidden", "true"
        );
        document.body.style.overflow = "";
    }

    // 7. DISPLAY ERROR MESSAGE
    showError(message) {

        this.familyTree.innerHTML = "";

        this.membersGrid.innerHTML = "";

        const treeError = document.createElement("p");
        treeError.textContent = message;

        const membersError = document.createElement("p");
        membersError.textContent = message;

        this.familyTree.appendChild(treeError);
        this.membersGrid.appendChild(membersError);
    }
}