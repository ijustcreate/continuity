const fs=require('fs'),assert=require('assert'),{Model,S}=require('./engine.js');
const results=[];function report(name,ok,extra){results.push({name,pass:ok,...extra});console.log(name,ok,extra);assert(ok,name);}
let seed=new Model();let base=seed.clone();console.time('grow');base.step(20000);console.timeEnd('grow');let bm=base.metrics(),total=seed.metrics().total;console.log('baseline',bm,base.components());
report('one_connected_body',base.components().length===1,{components:base.components(),area:bm.area});
report('mass_conservation',Math.abs(bm.total-total)<1e-7,{initial:total,final:bm.total,error:bm.total-total});
report('nonnegative_concentrations',bm.min>=0,{minimum:bm.min});
let wounded=base.clone(),control=base.clone();let hit=wounded.puncture(32,32,8);let before=wounded.metrics();wounded.step(6500);control.step(6500);let after=wounded.metrics();
let reference=hit.reduce((s,i)=>s+base.a[i]+base.b[i],0),fill=hit.reduce((s,i)=>s+wounded.a[i]+wounded.b[i],0)/reference;
const restoredSites=hit.filter(i=>wounded.a[i]+wounded.b[i]>1).length/hit.length;
report('puncture_and_local_repair',before.area<bm.area*.86&&after.area>bm.area*.94&&fill>.9,{before:bm.area,wounded:before.area,after:after.area,holeFill:fill,restoredSitesFraction:restoredSites,components:wounded.components()});
let turned=base.clone();turned.label();turned.wash=.12;let turnControl=base.clone();turned.step(8500);turnControl.step(8500);let diff=0;for(let i=0;i<S;i++)diff=Math.max(diff,Math.abs(turned.a[i]-turnControl.a[i]),Math.abs(turned.b[i]-turnControl.b[i]),Math.abs(turned.q[i]-turnControl.q[i]));
report('material_replaced_not_repainted',turned.metrics().original<.001&&diff===0,{originalFraction:turned.metrics().original,maxDensityDifference:diff});
let lost=base.clone();lost.coupling=0;lost.step(100);let lm=lost.metrics();report('relations_lost_matter_conserved',lm.area===0&&Math.abs(lm.total-bm.total)<1e-7,{activeArea:lm.area,massRelative:lm.total/bm.total,activeFraction:lm.active/bm.active});
let restore=base.clone();restore.coupling=0;restore.step(30);const rm=restore.metrics();restore.coupling=1;restore.step(5500);let re=restore.metrics();report('restore_from_residual_not_saved_shape',re.area>bm.area*.93,{interruptedArea:rm.area,restoredArea:re.area,components:restore.components()});
let lethal=base.clone();lethal.coupling=0;lethal.step(180);lethal.coupling=1;lethal.step(5500);report('irreversible_failure_visible',lethal.metrics().area===0,{after:lethal.metrics()});
let A=base.clone(),B=base.clone(),AB=base.clone();A.isolate('a');B.isolate('b');A.step(100);B.step(100);AB.step(100);report('mutual_dependence_control',A.metrics().area===0&&B.metrics().area===0&&AB.components().length===1,{a:A.metrics().area,b:B.metrics().area,ab:AB.metrics().area});
let mem=base.clone(),naive=base.clone();mem.pulse();naive.pulse();mem.learn=.2;mem.stimulus=naive.stimulus=.5;mem.step(700);naive.step(700);mem.stimulus=naive.stimulus=0;mem.step(4500);naive.step(4500);let divergence=0;for(let i=0;i<S;i++)divergence+=Math.abs(mem.a[i]+mem.b[i]-naive.a[i]-naive.b[i]);divergence/=naive.metrics().active;report('history_changes_response',mem.metrics().trace>1&&divergence>.02,{chemicalTrace:mem.metrics().trace,relativeDifference:divergence});
fs.writeFileSync(require('path').join(__dirname,'test-results.json'),JSON.stringify({model:'two-catalyst-reaction-diffusion',seed:717171,grid:64,dt:.04,results},null,2));
