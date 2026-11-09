(async () => {
    console.log(
        '%c' +
        '▗▖  ▗▖▗▄▄▄▖▗▄▄▖  ▗▄▖  ▗▄▄▖▗▄▄▄▖\n' +
        ' ▝▚▞▘   █  ▐▌ ▐▌▐▌ ▐▌▐▌     █  \n' +
        '  ▐▌    █  ▐▛▀▚▖▐▛▀▜▌▐▌     █  \n' +
        '▗▞▘▝▚▖  █  ▐▌ ▐▌▐▌ ▐▌▝▚▄▄▖  █  \n' +
        'version : 1.2 | WebK DOM',
        'color:#ff00ff; font-family:monospace; font-weight:bold; font-size:12px;'
    );
    // CHANGE 
    const PAUSE = 1400, MAX_IDLE = 12, MAX_LOOPS = 10;
    const box = document.querySelector('.search-super-content-members');

    if (!box || box.querySelectorAll('.peer-title').length === 0) {
        console.error('member list not loaded');
        return;
    }

    let scroller = box;
    while (scroller && scroller !== document.body && scroller.scrollHeight <= scroller.clientHeight + 20) {
        scroller = scroller.parentElement;
    }
    if (!scroller || scroller === document.body) scroller = box.querySelector('.scrollable-y, .scrollable') || box;

    const seen = new Map();
    let idle = 0;

    for (let i = 0; i < MAX_LOOPS; i++) {
        const before = seen.size;

        box.querySelectorAll('.peer-title').forEach(el => {
            const name = el.innerText.trim();
            if (!name) return;

            let row = el;
            for (let k = 0; k < 10 && row && row !== box; k++) {
                if (row.hasAttribute && row.hasAttribute('data-peer-id')) break;
                row = row.parentElement;
            }

            const peerId = (row && row.getAttribute) ? (row.getAttribute('data-peer-id') || '') : '';
            const key = peerId || ('name:' + name);
            if (seen.has(key)) return;

            let username = '', status = '';
            if (row && row.querySelector) {
                const u = row.querySelector('.peer-subtitle, .row-subtitle, .username, .info .subtitle');
                if (u) {
                    const txt = u.innerText.trim();
                    if (txt.startsWith('@')) username = txt;
                    else if (/last seen|online/i.test(txt)) status = txt;
                    else username = txt;
                }
            }

            const isDeleted = /^deleted account$/i.test(name);
            const isBot = !!(row && Array.from(row.querySelectorAll('*')).some(n =>
                n.children.length === 0 && /^bot$/i.test((n.textContent || '').trim())
            ));

            seen.set(key, { name, username, status, peerId, isDeleted, isBot });
        });

        console.log(`loop ${i + 1}: ${seen.size} total`);

        if (seen.size === before && i > 0) {
            if (++idle >= MAX_IDLE) { console.log('end of list'); break; }
        } else idle = 0;

        scroller.scrollTop = scroller.scrollHeight;
        await new Promise(r => setTimeout(r, PAUSE));
    }

    const all = [...seen.values()];
    const bots = all.filter(m => m.isBot);
    const deleted = all.filter(m => m.isDeleted);
    const humans = all.filter(m => !m.isBot && !m.isDeleted);

    console.log(`scraped: ${all.length} | deleted: ${deleted.length} | bots: ${bots.length} | final: ${humans.length}`);
    console.table(humans);

    try { copy(JSON.stringify(humans, null, 2)); } catch (e) {}

    const csv = 'Name,Username,Status,PeerID\n' + humans.map(m =>
        [m.name, m.username, m.status, m.peerId].map(v => `"${(v || '').replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));

    // csv format
    a.download = 'tg_members.csv';
    a.click();
})();
