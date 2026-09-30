/* Run: node test-parcels12.js. No dependencies. */
'use strict';const assert=require('node:assert/strict');
const {Model,DT}=require('./engine.js'),{Parcels}=require('./parcels12.js');
const base=new Model(717171);base.step(20000);
const m=base.clone(),control=base.clone();m.label();m.wash=1;
const p=new Parcels(m,717171,800),origin=m.metrics().total;
let focus=p.items.filter(p=>p.state<2&&m.a[p.i]+m.b[p.i]>1).sort((p,q)=>(m.a[p.i]+m.b[p.i])-(m.a[q.i]+m.b[q.i]))[0].id;
const logs=[],identities=new Map(p.items.map(p=>[p.id,p.old]));let trackedNew=false;
for(let n=1;n<=1060;n++){
 const ev=p.step(m);m.step();control.step();
 for(const x of p.items){if(identities.has(x.id))assert.equal(x.old,identities.get(x.id),'an identity was recoloured');else{assert.equal(x.old,false);identities.set(x.id,x.old);}}
 for(const e of ev)if(e.id===focus){logs.push({...e,step:n});if(e.kind==='exchange'){assert(e.newId>e.id);focus=e.newId;trackedNew=true;}else if(e.kind==='bind'&&trackedNew)focus=-1;}
 for(const key of ['a','b','q'])assert.deepEqual(m[key],control[key],'passive labels must not alter chemical dynamics');
 assert.equal(p.items.length,800);
}
assert.equal(logs[0].kind,'release');assert.equal(logs[0].step,20);
assert.equal(logs[1].kind,'exchange');assert.equal(logs[1].step,38);
assert.equal(logs[2].kind,'bind');assert.equal(logs[2].step,51);
assert(m.metrics().original<.001);assert(Math.abs(m.metrics().total-origin)<1e-8);
// Independent high-count sample: the fraction in original active form should
// agree statistically with the Eulerian material tracer, not be set from it.
const large=base.clone();large.label();large.wash=1;const lots=new Parcels(large,2026,20000);
for(let i=0;i<100;i++){lots.step(large);large.step();}
const stat=lots.stats(),observed=stat.oldBound/stat.bound,expected=large.metrics().original;
assert(Math.abs(observed-expected)<.02);
console.log(JSON.stringify({ok:true,steps:1060,original:m.metrics().original,activeArea:m.metrics().area,totalError:m.metrics().total-origin,singleParcel:logs,trackedSample:p.stats(),independentSample:{count:20000,observed,expected}},null,2));
