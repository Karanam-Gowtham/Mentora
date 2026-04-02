export async function getAnalysis() {
    const res = await fetch("http://127.0.0.1:8010/analysis");
    const data = await res.json();
    return data;
}