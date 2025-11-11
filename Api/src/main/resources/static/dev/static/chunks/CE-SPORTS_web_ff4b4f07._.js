(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/CE-SPORTS/web/components/ui/card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/CE-SPORTS/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/CE-SPORTS/web/lib/utils.ts [app-client] (ecmascript)");
;
;
function Card({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-xl border border-border bg-card p-4 shadow-sm transition hover:shadow-md", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/CE-SPORTS/web/components/ui/card.tsx",
        lineNumber: 6,
        columnNumber: 5
    }, this);
}
_c = Card;
var _c;
__turbopack_context__.k.register(_c, "Card");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PartidasPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/CE-SPORTS/web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/CE-SPORTS/web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/CE-SPORTS/web/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/CE-SPORTS/web/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/CE-SPORTS/web/components/ui/button.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function PartidasPage() {
    _s();
    const [partidas, setPartidas] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const normalizeName = (value)=>{
        if (!value) return "-";
        if (typeof value === "string") return value;
        return value.nome ?? "-";
    };
    const normalizeScore = (val)=>{
        if (val === null || val === undefined) return null;
        if (typeof val === "number") return val;
        const n = Number(val);
        return Number.isNaN(n) ? null : n;
    };
    const fetchPartidas = async ()=>{
        setLoading(true);
        setError(null);
        setPartidas(null);
        const candidates = [
            "/api/partida"
        ];
        let lastError = null;
        for (const url of candidates){
            try {
                const res = await fetch("http://localhost:8080/api/partida", {
                    method: "GET",
                    cache: "no-store"
                });
                if (!res.ok) {
                    lastError = `endpoint ${url} retornou ${res.status}`;
                    continue;
                }
                const json = await res.json();
                const arr = Array.isArray(json) ? json : json?.data ?? json?.content ?? json?.partidas ?? null;
                if (!arr || !Array.isArray(arr)) {
                    lastError = `endpoint ${url} retornou formato inesperado`;
                    continue;
                }
                const normalized = arr.map((p)=>({
                        ...p,
                        pontuacao1: normalizeScore(p.pontuacao1),
                        pontuacao2: normalizeScore(p.pontuacao2)
                    }));
                setPartidas(normalized);
                setLoading(false);
                return;
            } catch (e) {
                lastError = e;
            }
        }
        setLoading(false);
        setError(`Não foi possível obter partidas: ${typeof lastError === "string" ? lastError : lastError && lastError.message || "erro desconhecido"}. Verifique o endpoint da API.`);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PartidasPage.useEffect": ()=>{
            fetchPartidas();
        }
    }["PartidasPage.useEffect"], []);
    const sortedPartidas = (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PartidasPage.useMemo[sortedPartidas]": ()=>{
            if (!partidas) return null;
            return [
                ...partidas
            ].sort({
                "PartidasPage.useMemo[sortedPartidas]": (a, b)=>{
                    const aDate = a.data ? Date.parse(a.data) : NaN;
                    const bDate = b.data ? Date.parse(b.data) : NaN;
                    if (!Number.isNaN(aDate) && !Number.isNaN(bDate)) return bDate - aDate;
                    if (!Number.isNaN(aDate)) return -1;
                    if (!Number.isNaN(bDate)) return 1;
                    const aId = a.id ?? 0;
                    const bId = b.id ?? 0;
                    return bId - aId;
                }
            }["PartidasPage.useMemo[sortedPartidas]"]);
        }
    }["PartidasPage.useMemo[sortedPartidas]"], [
        partidas
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-background text-foreground py-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto px-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-bold text-black",
                                children: "Histórico de Partidas"
                            }, void 0, false, {
                                fileName: "[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx",
                                lineNumber: 123,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx",
                            lineNumber: 122,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/campeonatos",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        size: "sm",
                                        className: "border-blue-600 text-blue-600 hover:bg-blue-50",
                                        children: "← Voltar para Campeonatos"
                                    }, void 0, false, {
                                        fileName: "[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx",
                                        lineNumber: 130,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx",
                                    lineNumber: 129,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    size: "sm",
                                    onClick: ()=>{
                                        fetchPartidas();
                                    },
                                    children: "Refresh"
                                }, void 0, false, {
                                    fileName: "[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx",
                                    lineNumber: 139,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/campeonatos/registrar-partida",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        size: "sm",
                                        className: "border-blue-600 text-blue-600 hover:bg-blue-50 px-5",
                                        children: "➕ Nova Partida"
                                    }, void 0, false, {
                                        fileName: "[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx",
                                        lineNumber: 150,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx",
                                    lineNumber: 149,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx",
                            lineNumber: 128,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx",
                    lineNumber: 121,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                    className: "p-4",
                    children: [
                        loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "py-8 text-center",
                            children: "Carregando partidas..."
                        }, void 0, false, {
                            fileName: "[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx",
                            lineNumber: 163,
                            columnNumber: 13
                        }, this),
                        !loading && error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "py-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-red-600 mb-2",
                                    children: [
                                        "Erro: ",
                                        error
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx",
                                    lineNumber: 168,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-muted-foreground mb-4",
                                    children: "Se a API não estiver pronta, você pode usar dados mock:"
                                }, void 0, false, {
                                    fileName: "[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx",
                                    lineNumber: 169,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        onClick: ()=>fetchPartidas(),
                                        children: "Tentar novamente"
                                    }, void 0, false, {
                                        fileName: "[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx",
                                        lineNumber: 173,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx",
                                    lineNumber: 172,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx",
                            lineNumber: 167,
                            columnNumber: 13
                        }, this),
                        !loading && sortedPartidas && sortedPartidas.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "py-8 text-center text-muted-foreground",
                            children: "Nenhuma partida encontrada."
                        }, void 0, false, {
                            fileName: "[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx",
                            lineNumber: 181,
                            columnNumber: 13
                        }, this),
                        !loading && sortedPartidas && sortedPartidas.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "overflow-x-auto",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                className: "min-w-full text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                        className: "bg-blue-600 text-white",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "p-2 text-left",
                                                    children: "Campeonato"
                                                }, void 0, false, {
                                                    fileName: "[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx",
                                                    lineNumber: 191,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "p-2 text-left",
                                                    children: "Equipe 1"
                                                }, void 0, false, {
                                                    fileName: "[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx",
                                                    lineNumber: 192,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "p-2 text-left",
                                                    children: "Equipe 2"
                                                }, void 0, false, {
                                                    fileName: "[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx",
                                                    lineNumber: 193,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "p-2 text-left",
                                                    children: "Placar"
                                                }, void 0, false, {
                                                    fileName: "[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx",
                                                    lineNumber: 194,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "p-2 text-left",
                                                    children: "Resultado"
                                                }, void 0, false, {
                                                    fileName: "[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx",
                                                    lineNumber: 195,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "p-2 text-left",
                                                    children: "Data"
                                                }, void 0, false, {
                                                    fileName: "[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx",
                                                    lineNumber: 196,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx",
                                            lineNumber: 190,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx",
                                        lineNumber: 189,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                        children: sortedPartidas.map((p, idx)=>{
                                            const camp = normalizeName(p.campeonato);
                                            const e1 = normalizeName(p.equipe1);
                                            const e2 = normalizeName(p.equipe2);
                                            const g1 = p.pontuacao1 ?? null;
                                            const g2 = p.pontuacao2 ?? null;
                                            const left = g1 === null ? "-" : String(g1);
                                            const right = g2 === null ? "-" : String(g2);
                                            const placarDisplay = g1 === null && g2 === null ? "Pendente" : `${left} × ${right}`;
                                            let resultado = "-";
                                            if (p.empate) resultado = "Empate";
                                            else if (p.vencedor) resultado = normalizeName(p.vencedor);
                                            else if (typeof g1 === "number" && typeof g2 === "number") {
                                                if (g1 > g2) resultado = e1;
                                                else if (g2 > g1) resultado = e2;
                                                else resultado = "—";
                                            }
                                            const dataStr = p.data ? new Date(p.data).toLocaleString("pt-BR") : "-";
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                className: "border-t border-border hover:bg-muted/30 transition",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "p-2 text-black",
                                                        children: camp
                                                    }, void 0, false, {
                                                        fileName: "[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx",
                                                        lineNumber: 233,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "p-2",
                                                        children: e1
                                                    }, void 0, false, {
                                                        fileName: "[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx",
                                                        lineNumber: 234,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "p-2",
                                                        children: e2
                                                    }, void 0, false, {
                                                        fileName: "[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx",
                                                        lineNumber: 235,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "p-2 font-medium",
                                                        children: placarDisplay
                                                    }, void 0, false, {
                                                        fileName: "[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx",
                                                        lineNumber: 236,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "p-2",
                                                        children: resultado
                                                    }, void 0, false, {
                                                        fileName: "[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx",
                                                        lineNumber: 237,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$CE$2d$SPORTS$2f$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "p-2",
                                                        children: dataStr
                                                    }, void 0, false, {
                                                        fileName: "[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx",
                                                        lineNumber: 238,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, p.id ?? idx, true, {
                                                fileName: "[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx",
                                                lineNumber: 229,
                                                columnNumber: 23
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx",
                                        lineNumber: 200,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx",
                                lineNumber: 188,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx",
                            lineNumber: 187,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx",
                    lineNumber: 161,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx",
            lineNumber: 120,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/CE-SPORTS/web/app/(app)/campeonatos/historico-partidas/page.tsx",
        lineNumber: 119,
        columnNumber: 5
    }, this);
}
_s(PartidasPage, "ONTgIyLFS/WIsmZSgbcecGje5iU=");
_c = PartidasPage;
var _c;
__turbopack_context__.k.register(_c, "PartidasPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=CE-SPORTS_web_ff4b4f07._.js.map