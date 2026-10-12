/* SETUP: Replace WHATSAPP_NUMBER with your number in international format, no + or spaces. Sri Lanka example: 94771234567. Edit PRODUCTS to change names and rental prices. */
const WHATSAPP_NUMBER="94788009446";
 // REPLACE THIS
const PRODUCTS=[
{
id:"num1",name:"Illuminated Number 1",category:"Letters & Numbers",price:2500,subtitle:"A glowing milestone moment",visual:"1",description:"A statement illuminated number for birthdays, anniversaries and milestone celebrations. Ask us to confirm availability for your event date."}
,
{
id:"num8",name:"Illuminated Number 8",category:"Letters & Numbers",price:2500,subtitle:"Make the age unforgettable",visual:"8",description:"A warm-glow illuminated number for photos, birthdays and milestone celebrations."}
,
{
id:"love",name:"LOVE Letters",category:"Letters & Numbers",price:8000,subtitle:"A romantic statement piece",visual:"LOVE",description:"Illuminated LOVE letters for weddings, engagements, anniversaries and romantic celebrations."}
,
{
id:"hbd",name:"HAPPY BIRTHDAY",category:"Letters & Numbers",price:12000,subtitle:"The birthday photo moment",visual:"HBD",description:"A birthday statement for your celebration backdrop. Message us with the date and venue to confirm availability."}
,
{
id:"frame",name:"Backdrop Frame",category:"Backdrops",price:3500,subtitle:"A simple stage for your moment",visual:"FRAME",description:"A backdrop frame to create a neat focal point for your event styling. Ask about dimensions and available finishes."}
,
{
id:"curtain",name:"Warm Light Curtain",category:"Lighting",price:2500,subtitle:"Soft ambient sparkle",visual:"✳",description:"A warm light curtain for adding soft atmosphere behind a cake table, backdrop or photo area."}
,
{
id:"uplights",name:"LED Uplights (Pair)",category:"Lighting",price:3000,subtitle:"Set the mood with light",visual:"02",description:"LED uplights to add colour and atmosphere to your celebration space."}
,
{
id:"speaker",name:"Bluetooth Party Speaker",category:"Party Essentials",price:4000,subtitle:"Bring the party together",visual:"♫",description:"A Bluetooth speaker for music at your celebration. Confirm model, availability and rental terms with us."}

];

const $=id=>document.getElementById(id),money=n=>"LKR "+Number(n).toLocaleString("en-LK");
let cart=[],active=null,timer;

function toast(s){
$('toast').textContent=s;
$('toast').classList.add('show');
clearTimeout(timer);
timer=setTimeout(()=>$('toast').classList.remove('show'),2800)}

function wa(message){
let n=WHATSAPP_NUMBER.replace(/\D/g,'');
if(!n||n.includes('788009446')||n.length<10){
toast('Please add your WhatsApp number in script.js first.');
return}
window.open('https://wa.me/'+n+'?text='+encodeURIComponent(message),'_blank','noopener,noreferrer')}

function vclass(v){
return String(v).length>3?'visual word':'visual'}

function render(){
let q=$('search').value.trim().toLowerCase(),cat=$('category').value,sort=$('sort').value;
let a=PRODUCTS.filter(p=>(cat==='all'||p.category===cat)&&(`${
p.name}
 ${
p.category}
 ${
p.subtitle}
 ${
p.description}
`).toLowerCase().includes(q));
if(sort==='low')a.sort((x,y)=>x.price-y.price);
if(sort==='high')a.sort((x,y)=>y.price-x.price);
if(sort==='name')a.sort((x,y)=>x.name.localeCompare(y.name));
$('resultCount').textContent=`${
a.length}
 ${
a.length===1?'piece':'pieces'}
`;
$('products').innerHTML=a.map(p=>`<article class="product"><div class="product-art" data-open="${
p.id}
" role="button" tabindex="0" aria-label="View ${
p.name}
"><span class="corner">CI / RENTAL</span><span class="${
vclass(p.visual)}
">${
p.visual}
</span><span class="art-label">${
p.category.toUpperCase()}
</span><button class="quick" data-open="${
p.id}
" aria-label="View ${
p.name}
">+</button></div><div class="meta"><div><p class="category">${
p.category}
</p><h3>${
p.name}
</h3><p class="subtitle">${
p.subtitle}
</p></div><span class="price">${
money(p.price)}
</span></div></article>`).join('');
$('empty').hidden=a.length>0}

function product(id){
active=PRODUCTS.find(p=>p.id===id);
if(!active)return;
$('modalCategory').textContent=active.category;
$('modalName').textContent=active.name;
$('modalDesc').textContent=active.description;
$('modalPrice').textContent=money(active.price);$('modalArt').innerHTML=`<span class="${
vclass(active.visual)}
">${
active.visual}
</span>`;
$('qty').value=1;
document.querySelector('input[name="method"][value="Pickup"]').checked=true;
$('modalWrap').hidden=false;
document.body.classList.add('lock')}

function closeProduct(){
$('modalWrap').hidden=true;
document.body.classList.remove('lock');
active=null}

function add(){
if(!active)return;
let qty=Math.max(1,Math.min(99,parseInt($('qty').value)||1)),method=document.querySelector('input[name="method"]:checked').value,old=cart.find(i=>i.id===active.id&&i.method===method);
if(old)old.qty+=qty;
else cart.push({
id:active.id,qty,method}
);
closeProduct();
renderCart();
toast('Added to your bag.')}

function renderCart(){
let count=cart.reduce((s,i)=>s+i.qty,0);
$('count').textContent=count;
$('drawerCount').textContent='('+count+')';$('cartItems').innerHTML=cart.map((i,k)=>{
let p=PRODUCTS.find(x=>x.id===i.id);
return `<div class="cart-row"><div class="thumb">${
p.visual}
</div><div><h3>${
p.name}
</h3><div class="detail">${
i.method}
 · ${
money(p.price)}
 / event</div><div class="actions"><div class="mini"><button data-qty="-1" data-i="${
k}
">−</button><span>${
i.qty}
</span><button data-qty="1" data-i="${
k}
">+</button></div><button class="remove" data-remove="${
k}
">Remove</button></div></div><span class="lineprice">${
money(p.price*i.qty)}
</span></div>`}
).join('');
$('cartEmpty').hidden=count>0;
$('checkout').hidden=count===0;
$('total').textContent=money(cart.reduce((s,i)=>s+PRODUCTS.find(p=>p.id===i.id).price*i.qty,0))}

function openCart(){
$('shade').hidden=false;
$('drawer').classList.add('open');
document.body.classList.add('lock')}

function closeCart(){
$('drawer').classList.remove('open');$('shade').hidden=true;
document.body.classList.remove('lock')}

function checkout(){
if(!cart.length)return;
let name=$('customerName').value.trim();
if(!name){
$('customerName').focus();
toast('Please enter your name.');
return}
let date=$('eventDate').value||'Not specified',venue=$('venue').value.trim()\vert{}\vert{}'Not specified',notes=$('notes').value.trim()||'None',items=cart.map((i,k)=>{
let p=PRODUCTS.find(x=>x.id===i.id);
return `${
k+1}
. ${
p.name}

   Quantity: ${
i.qty}

   Rental: ${
money(p.price)}
 x ${
i.qty}
 = ${
money(p.price*i.qty)}

   Preference: ${
i.method}
`}
).join('

'),total=cart.reduce((s,i)=>s+PRODUCTS.find(p=>p.id===i.id).price*i.qty,0);
wa(`Hello CRUIZ ILLUMINATION! I'd like to enquire about a rental booking.

CUSTOMER DETAILS
Name: ${
name}

Event date: ${
date}

Venue / area: ${
venue}


MY SELECTION
${
items}


Estimated rental total: ${
money(total)}

Additional notes: ${
notes}


Please confirm availability, delivery charges (if applicable), security deposit and booking terms. I understand this is a booking enquiry and no online payment has been made.`)}

$('products').addEventListener('click',e=>{ let t=e.target.closest('[data-open]'); if(t)product(t.dataset.open)} );$('products').addEventListener('keydown',e=>{
if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-open]')){
e.preventDefault();
product(e.target.dataset.open)}
}
);
['search','category','sort'].forEach(id=>$(id).addEventListener(id==='search'?'input':'change',render));
$('clear').addEventListener('click',()=>{$('search').value='';
$('category').value='all';$('sort').value='featured';
render()}
);
$('openCart').addEventListener('click',openCart);$('closeCart').addEventListener('click',closeCart);
$('shade').addEventListener('click',closeCart);$('continue').addEventListener('click',()=>{
closeCart();
$('collection').scrollIntoView({
behavior:'smooth'}
)}
);
$('modalClose').addEventListener('click',closeProduct);$('modalShade').addEventListener('click',closeProduct);
$('minus').addEventListener('click',()=>$('qty').value=Math.max(1,(parseInt($('qty').value)\vert{}\vert{}1)-1));$('plus').addEventListener('click',()=>$('qty').value=Math.min(99,(parseInt($('qty').value)||1)+1));
$('add').addEventListener('click',add);$('cartItems').addEventListener('click',e=>{
let q=e.target.closest('[data-qty]'),r=e.target.closest('[data-remove]');
if(q){
let i=+q.dataset.i;
cart[i].qty+=+q.dataset.qty;
if(cart[i].qty<=0)cart.splice(i,1);
renderCart()}
if(r){
cart.splice(+r.dataset.remove,1);
renderCart()}
}
);
$('checkoutWA').addEventListener('click',checkout);$('contactWA').addEventListener('click',()=>wa('Hello CRUIZ ILLUMINATION! I would like to ask about your event décor rental collection.'));
$('year').textContent=new Date().getFullYear();
render();
renderCart();