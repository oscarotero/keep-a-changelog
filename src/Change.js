class Change {
    constructor(title, description = '') {
        this.issues = [];
        this.title = extractIssues(title, this.issues);
        this.description = extractIssues(description, this.issues);
    }

    toString() {
        let t = this.title.split('\n').map(line => `  ${line.trim()}`);
        t[0] = '-' + t[0].substr(1);

        if (this.description) {
            t.push('');

            t = t.concat(this.description.split('\n').map(line => `  ${line}`));
        }

        return t.join('\n').trim();
    }
}

module.exports = Change;

function extractIssues(text, issues) {
    return text
        .replace(/\[#(\d+)\]([^\(]|$)/g, (matches, index, end) => {
            if (!issues.includes(index)) {
                issues.push(index);
            }

            return `[#${index}]${end}`;
        })
        .replace(/#(\d+)([^\w\]\.]|[^\d\w]?$)/g, (matches, index, end) => {
            if (!issues.includes(index)) {
                issues.push(index);
            }

            return `[#${index}]${end}`;
        });
}
