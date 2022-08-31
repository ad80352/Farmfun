const top = 0;

function returnTop() {
 window.scrollBy(0,-100);//Only for y vertical-axis
 if(document.body.scrollTop>0) { 
  top = setTimeout('returnTop()',50);
 }
}