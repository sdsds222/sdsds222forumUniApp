function r(r){try{const n=r.split(".");if(3===n.length){return JSON.parse(atob(n[1]))}throw new Error("Invalid JWT Token")}catch(n){return console.error("JWT Parsing Error:",n),null}}export{r as p};
