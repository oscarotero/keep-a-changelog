class Change {
    constructor(title, description = '') {
        this.title = title;
        this.description = description;
    }

    toString() {
        let t = [`- ${this.title}`];

        if (this.description) {
            t = t.concat(this.description.split('\n').map(line => `  ${line}`));
        }

        return t.join('\n').trim();
    }
}

module.exports = Change;
