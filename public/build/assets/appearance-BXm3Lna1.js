import{u as m,j as e,L as d}from"./app--xgSMu8m.js";import{c as n}from"./utils-bRKmu4jq.js";import{c as a}from"./createLucideIcon-DF-M5Tia.js";import{H as u}from"./heading-small-DodLnd_T.js";import{S as h}from"./layout-BC0juRs3.js";import{C as x}from"./content-layout-BOG04L-D.js";import"./heading--swNWzJW.js";import"./button-BGZQJ0Ba.js";import"./index-BwWXEq4-.js";import"./index-DwLL3azA.js";import"./index-CO6rcehI.js";import"./app-logo-icon-CnfBnbLe.js";import"./chevron-right-D_nz7_XC.js";import"./Combination-LpGtPM2s.js";import"./floating-ui.dom-C5vApqfE.js";import"./chevron-down-B3ssbDY0.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=[["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["line",{x1:"8",x2:"16",y1:"21",y2:"21",key:"1svkeh"}],["line",{x1:"12",x2:"12",y1:"17",y2:"21",key:"vw1qmm"}]],k=a("Monitor",y);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]],f=a("Moon",g);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]],j=a("Sun",b);function v({className:r="",...i}){const{appearance:o,updateAppearance:c}=m(),s=[{value:"light",icon:j,label:"Light"},{value:"dark",icon:f,label:"Dark"},{value:"system",icon:k,label:"System"}];return e.jsx("div",{className:n("inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800",r),...i,children:s.map(({value:t,icon:p,label:l})=>e.jsxs("button",{onClick:()=>c(t),className:n("flex items-center rounded-md px-3.5 py-1.5 transition-colors",o===t?"bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100":"text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60"),children:[e.jsx(p,{className:"-ml-1 h-4 w-4"}),e.jsx("span",{className:"ml-1.5 text-sm",children:l})]},t))})}const M=[{title:"Inicio",href:"/dashboard"},{title:"Configuración de apariencia",href:"/settings/appearance"}];function Z(){return e.jsxs(x,{breadcrumbs:M,children:[e.jsx(d,{title:"Configuración de apariencia"}),e.jsx(h,{children:e.jsxs("div",{className:"space-y-6",children:[e.jsx(u,{title:"Configuración de apariencia",description:"Actualiza la configuración de apariencia de tu cuenta"}),e.jsx(v,{})]})})]})}export{Z as default};
