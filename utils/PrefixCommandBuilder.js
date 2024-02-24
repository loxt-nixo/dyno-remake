class PrefixCommandBuilder {
    constructor() {
        this.name = "";
        this.description = "";
        this.aliases = [];
    }

    setName(name) {
        if (typeof name !== 'string') throw new Error('[PrefixCommandBuilder] Invalid name - Must be a string');

        this.name = name;
        return this;
    }

    setDescription(description) {
        if (typeof description !== 'string') throw new Error('[PrefixCommandBuilder] Invalid description - Must be a string');

        this.description = description;
        return this;
    }

    addAliases(...aliases) {
        if (!Array.isArray(aliases)) throw new Error('[PrefixCommandBuilder] Invalid aliases - Must be an array');

        this.aliases.push(...aliases);
        return this;
    }

    toJSON() {
        return {
            name: this.name,
            description: this.description,
            aliases: this.aliases,
        };
    }
} 

module.exports = { PrefixCommandBuilder }