class Change {
    static create(title) {
        return new Change(title);
    }

    constructor(title) {
        this.title = title;
        this.body = null;
    }

    toString() {
        let t = [`- ${this.title}`];

        if (this.body) {
            t = t.concat(this.body.split('\n').map(line => `  ${line}`));
        }

        return t.join('\n').trim();
    }
}

module.exports = Change;
