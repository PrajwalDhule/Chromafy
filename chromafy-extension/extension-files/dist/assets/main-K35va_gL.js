import{r as d,j as i,R as l,A as u}from"./index-oAwALE1H.js";(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))c(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const o of t.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&c(o)}).observe(document,{childList:!0,subtree:!0});function a(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function c(e){if(e.ep)return;e.ep=!0;const t=a(e);fetch(e.href,t)}})();var s={},n=d;s.createRoot=n.createRoot,s.hydrateRoot=n.hydrateRoot;s.createRoot(document.getElementById("chromafy-root")).render(i.jsx(l.StrictMode,{children:i.jsx(u,{})}));
