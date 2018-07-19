import css from './index.css'
import sass from './css/back.scss'
const a=10;
const b=20;
console.log(a > b);

let logo=require('./images/2.jpg');
let img=new Image();
img.style.width='200px';
img.style.height='100px';
img.src=logo;
//
document.body.appendChild(img);
// document.body.innerHTML='测试webpack';


$('.sa').text('jquery');