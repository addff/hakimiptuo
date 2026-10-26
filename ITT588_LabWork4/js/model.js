export class FamilyModel {

    constructor() {
        this.familyName = "";
        this.description = "";
        this.members = [];
    }

    // 1. LOAD FAMILY DATA FROM JSON
    async loadFamilyData() {

        try {

            const response = await fetch("./data/family.json");

            if (!response.ok) {
                throw new Error("Unable to load family JSON data.");
            }

            const data = await response.json();

            this.familyName = data.familyName;
            this.description = data.description;
            this.members = data.members;

            console.log("Family JSON loaded successfully.");
            console.log("Family Name:", this.familyName);
            console.log("Total Members:", this.members.length);

            return this.members;

        } catch (error) {

            console.error("Error loading family data:", error);

            throw error;
        }
    }

    // 2. GET ALL FAMILY MEMBERS
    getAllMembers() {
        return this.members;
    }

    // 3. FIND MEMBER BY ID
    getMemberById(id) {

        return this.members.find(
            member => member.id === Number(id)
        );

    }

    // 4. GET FATHER
    getFather(member) {

        if (member.fatherId === null) {
            return null;
        }

        return this.getMemberById(member.fatherId);
    }

    // 5. GET MOTHER
    getMother(member) {

        if (member.motherId === null) {
            return null;
        }

        return this.getMemberById(member.motherId);
    }

    // 6. GET SPOUSE
    getSpouse(member) {

        if (member.spouseId === null) {
            return null;
        }

        return this.getMemberById(member.spouseId);
    }

    // 7. GET CHILDREN
    getChildren(member) {

        return member.childrenIds
            .map(id => this.getMemberById(id))
            .filter(child => child !== undefined);

    }

    // 8. SEARCH MEMBERS BY NAME
    searchMembers(keyword) {

        const searchText = keyword.toLowerCase().trim();

        return this.members.filter(member =>
            member.name.toLowerCase().includes(searchText)
        );

    }

    // 9. FILTER BY GENERATION
    filterByGeneration(generation) {

        if (generation === "all") {
            return this.members;
        }

        return this.members.filter(
            member => member.generation === Number(generation)
        );

    }

    // 10. SEARCH AND FILTER TOGETHER
    getFilteredMembers(keyword, generation) {

        const searchText = keyword.toLowerCase().trim();

        return this.members.filter(member => {

            const matchesName =
                member.name.toLowerCase().includes(searchText);

            const matchesGeneration =
                generation === "all" ||
                member.generation === Number(generation);

            return matchesName && matchesGeneration;

        });

    }

    // 11. GET FAMILY STATISTICS
    getStatistics() {

        const totalMembers = this.members.length;

        const generations = [
            ...new Set(
                this.members.map(member => member.generation)
            )
        ];

        const totalGenerations = generations.length;

        const couples = this.members.filter(member =>
            member.spouseId !== null &&
            member.id < member.spouseId
        );

        return {
            totalMembers: totalMembers,
            totalGenerations: totalGenerations,
            totalFamilies: couples.length
        };

    }

    // 12. GROUP MEMBERS BY GENERATION
    groupByGeneration(members = this.members) {

        const groups = {};

        members.forEach(member => {

            const generation = member.generation;

            if (!groups[generation]) {
                groups[generation] = [];
            }

            groups[generation].push(member);

        });

        return groups;

    }

}
