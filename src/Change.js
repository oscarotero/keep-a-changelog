class Change {
    constructor(title, description = '') {
        this.issues = [];
        this.title = Change.extractIssues(title, this.issues);
        this.description = Change.extractIssues(description, this.issues);
    }

    toString() {
        let t = this.title.split('\n').map((line) => `  ${line}`);
        t[0] = '-' + t[0].substr(1);

        if (this.description) {
            t.push('');

            t = t.concat(this.description.split('\n').map((line) => `  ${line}`));
        }

        return t.join('\n').trim();
    }
}

module.exports = Change;

Change.extractIssues = function (text, issues) {
    return text
        .replace(/(^|[^\\])\[#(\d+)\](?=[^\(]|$)/g, (matches, start, index) => {
            if (!issues.includes(index)) {
                issues.push(index);
            }

            return `${start}[#${index}]`;
        })
        .replace(/(^|[\s,])#(\d+)(?=[\s,\.]|$)/g, (matches, start, index) => {
            if (!issues.includes(index)) {
                issues.push(index);
            }

            return `${start}[#${index}]`;
        });
};
