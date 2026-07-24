#!/usr/bin/env node
// Holt die aktuelle Kreisliga-Tabelle der Herren 1 von volleyball.bayern
// und schreibt sie nach data/herren-1-tabelle.json. Wird per GitHub Action
// (.github/workflows/update-herren-1-tabelle.yml) regelmäßig ausgeführt.
'use strict';

const fs = require('fs');
const path = require('path');

const SOURCE_URL = 'https://volleyball.bayern/ergebnisse/erwachsene/oberpfalz/wettbewerb-38740';
const OUTPUT_PATH = path.join(__dirname, '..', 'data', 'herren-1-tabelle.json');
const OWN_TEAM_MATCH = 'Neutraubling';

function stripTags(html) {
    return html
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/\s+/g, ' ')
        .trim();
}

async function main() {
    const res = await fetch(SOURCE_URL, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TSV-Neutraubling-TabellenBot/1.0)' }
    });
    if (!res.ok) {
        throw new Error(`Fetch fehlgeschlagen: HTTP ${res.status}`);
    }
    const html = await res.text();

    const anchorIndex = html.indexOf('id="tabellenrunde0"');
    if (anchorIndex === -1) {
        throw new Error('Tabellen-Anker "tabellenrunde0" nicht gefunden - Seitenstruktur hat sich vermutlich geändert.');
    }
    const tableStart = html.indexOf('<table', anchorIndex);
    const tableEnd = html.indexOf('</table>', tableStart);
    if (tableStart === -1 || tableEnd === -1) {
        throw new Error('Tabellen-Markup nicht gefunden.');
    }
    const tableHtml = html.slice(tableStart, tableEnd);

    const tbodyMatch = tableHtml.match(/<tbody>([\s\S]*)<\/tbody>/);
    if (!tbodyMatch) {
        throw new Error('<tbody> der Tabelle nicht gefunden.');
    }

    const rowMatches = [...tbodyMatch[1].matchAll(/<tr>([\s\S]*?)<\/tr>/g)];
    if (rowMatches.length === 0) {
        throw new Error('Keine Tabellenzeilen gefunden.');
    }

    const rows = rowMatches.map((rowMatch) => {
        const rowHtml = rowMatch[1];

        const rankMatch = rowHtml.match(/<th[^>]*>([\s\S]*?)<\/th>/);
        const rank = rankMatch ? parseInt(stripTags(rankMatch[1]), 10) : null;

        const teamMatch = rowHtml.match(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/);
        const team = teamMatch ? stripTags(teamMatch[2]) : null;
        const teamUrl = teamMatch ? teamMatch[1] : null;

        // Zellen: [0] Trend-Icon, [1] Team (bereits oben geparst), [2..9] Statistik-Werte
        const cellValues = [...rowHtml.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((m) => stripTags(m[1]));
        const stats = cellValues.slice(2);

        return {
            rank,
            team,
            teamUrl: teamUrl ? new URL(teamUrl, SOURCE_URL).toString() : null,
            played: stats[0] ?? null,
            won: stats[1] ?? null,
            lost: stats[2] ?? null,
            points: stats[3] ?? null,
            setsRatio: stats[4] ?? null,
            setsQuotient: stats[5] ?? null,
            ballsRatio: stats[6] ?? null,
            ballsQuotient: stats[7] ?? null,
            isOwnTeam: Boolean(team && team.includes(OWN_TEAM_MATCH)),
        };
    }).filter((row) => row.rank !== null && row.team);

    if (rows.length === 0) {
        throw new Error('Tabelle wurde geparst, enthält aber keine gültigen Zeilen.');
    }

    const output = {
        updatedAt: new Date().toISOString(),
        sourceUrl: SOURCE_URL,
        rows,
    };

    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + '\n', 'utf8');
    console.log(`Tabelle aktualisiert: ${rows.length} Teams -> ${OUTPUT_PATH}`);
}

main().catch((err) => {
    console.error('Fehler beim Aktualisieren der Tabelle:', err.message);
    process.exit(1);
});
