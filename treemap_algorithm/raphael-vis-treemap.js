
var colors1=["hsb(0,1,0.4)","hsb(0,1,0.4)", "hsb(0.1,1,0.4)", "hsb(0.2,1,0.4)","hsb(0.3,1,0.4)", "hsb(0.4,1,0.4)", "hsb(0.5,1,0.4)", "hsb(0.6,1,0.4)","hsb(0.7,1,0.4)","hsb(0.8,1,0.4)","hsb(0.8,1,0.4)"];
var colors2=["hsb(1,0.4,0)", "hsb(1,0.4,0)", "hsb(1,0.4,0.1)", "hsb(1,0.4,0.2)", "hsb(1,0.4,0.3)", "hsb(1,0.4,0.4)", "hsb(1,0.4,0.5)", "hsb(1,0.4,0.6)", "hsb(1,0.4,0.7)", "hsb(1,0.4,0.8)","hsb(1,0.4,0.8)"];
var colors3=["hsb(1,0,0.4)", "hsb(1,0,0.4)", "hsb(1,0.1,0.4)", "hsb(1,0.2,0.4)","hsb(1,0.3,0.4)", "hsb(1,0.4,0.4)","hsb(1,0.5,0.4)", "hsb(1,0.6,0.4)", "hsb(1,0.7,0.4)", "hsb(1,0.8,0.4)","hsb(1,0.8,0.4)"];
var colors=[colors1,colors2,colors3];   //目前支持三种颜色

function isArray(arr) {
    return arr && arr.constructor === Array; 
}
function CalcTotLabelLens(labels){
    var i;
    var len = labels.length;
    var sum = 0;
    for(i = 0; i< len; i++){
        if(isArray(labels[i])){
            sum += CalcTotLabelLens(labels[i]);
        }else{
            sum += labels[i].length;
        }
    }
    return sum;
}
function CntLabels(labels){
    var i;
    var len = labels.length;
    var sum = 0;
    for(i = 0; i< len; i++){
        if(isArray(labels[i])){
            sum += CntLabels(labels[i]);
        }else{
            sum += 1;
        }
    }
    return sum;
}
function CalcTextStyle(averageLen,area){    
    return Math.min(Math.pow(area,0.5)/averageLen,30);
}
function DefaultStyle(){
    var boxStyle = { "stroke": "FEFEFE", "fill" : colors[0][0]};
    var textStyle = { "fill" : "#FCFCFC", "font-size": 30};
    var bgStyle = {"fill":"#000000"};
    var style = {};
    //style字典有三个键，box，text和bg。
    style.box = boxStyle;
    style.text = textStyle;
    style.bg = bgStyle;
    return style;
}
function AddStyle(basestyle,addstyle){
    var item;
    for (item in addstyle){
        basestyle[item] = addstyle[item];
    }
    return basestyle;
}
String.prototype.format = function() {
    var formatted = this;
    for( var arg in arguments ) {
        formatted = formatted.replace("{" + arg + "}", arguments[arg]);
    }
    return formatted;
};
function calcOffset(data){
    if(Math.round(data/100)){
        return 15
    }
    if(data/10>=1){
        return 6
    }
    else{
        return 3
    }
}
function drawAbox(paper,coordinates,label,data,boxstyle,labelstyle,averageLen,color){   
    var width = coordinates[2]-coordinates[0], height = coordinates[3]-coordinates[1];
    var box = paper.rect(coordinates[0],coordinates[1],width,height);
    var boxattr = boxstyle;
    boxattr.fill = color;
    box.attr(boxattr);

    var text = paper.text((coordinates[0]+coordinates[2])/2,(coordinates[1]+coordinates[3])/2,label);
    labelstyle["font-size"] = CalcTextStyle(averageLen,width*height);
    text.attr(labelstyle);
    
    //var template = "Area = {0}, Data = {1}";
    var sub_text = paper.text(coordinates[2]-calcOffset(data),coordinates[3]-8,data/*template.format(Math.round(width*height),data)*/);
    var sub_style = labelstyle;
    sub_style["font-size"] = Math.max(CalcTextStyle(averageLen,width*height)/2,5);
    sub_style["font-weight"] = 5;
    sub_text.attr(sub_style);

    if(text.getBBox().width > width && text.getBBox().width <= height) { //根据box的情况，决定text要不要转置
        text.rotate(-90); //尝试90度，旋转找到最合适的状态。
    }

    if(sub_text.getBBox().width > width || sub_text.getBBox().height > height) { //根据box的情况，决定text要不要转置
        sub_text.remove();
    }
}
function isCoo(arr){
    var i;
    var len = arr.length;
    if(len!=4)
        return false;
    for(i = 0; i < len; i++){
        if(isArray(arr[i])){
            return false;
        }
    }
    return true;
}
function oneLevelCoos(arr){
    if(!isArray(arr))
        return false;
    var i;
    for(i=0;i<arr.length;i++){
        if(!isCoo(arr[i])){
            return false;
        }
    }
    return true;
}
function zoomIn(boxes,pos){ //pos为0表示头，pos为1表示尾部
    if(boxes.length == 0){
        throw "Error"; 
    }
    var idx = (pos == 0 )? 0:boxes.length-1;
    if(!isCoo(boxes[idx])){
        return zoomIn(boxes[idx]);
    }
    return boxes[idx];
}
function Drawer(paper,boxes,labels,data,nowstyle,level,averageLen){
    var i;
    var color = colors[level%3][Math.round(Math.random()*10)];
    //var first = zoomIn(boxes,0),last = zoomIn(boxes,1);
    //first[0],first[1],last[2]-first[0],last[3]-first[1]
    //console.log("light_area",first[0],first[1],last[2]-first[0],last[3]-first[1])
    if(oneLevelCoos(boxes)){
        for(i=0;i<boxes.length;i++){
            //Math.round(Math.random()*4)获取0或4的概率少一个半。
            drawAbox(paper,boxes[i],labels[i],data[i],nowstyle.box,nowstyle.text,averageLen,color);
        }
    }else{
        for(i=0;i<boxes.length;i++){
            if(isCoo(boxes[i])){
                drawAbox(paper,boxes[i],labels[i],data[i],nowstyle.box,nowstyle.text,averageLen,color);
            }else{
                Drawer(paper,boxes[i],labels[i],data[i],nowstyle,level+1,averageLen);
            }
        }
    }
}
function TreemapDraw(ele,data,labels,width,height,style){
    var nowstyle = (typeof style === "undefined") ? DefaultStyle(): AddStyle(DefaultStyle(),style);
    console.log(nowstyle);
    var paper = new Raphael(ele,width,height);
    var background = paper.rect(0,0,width,height);
    background.attr(nowstyle.bg);
    //sorting?
    var area = calcArea(data,width*height);
    //console.log("area",area);
    var boxes = nestedSquarifiedTreemap(area,0,0,width,height);
    console.log("boxes",boxes);

    var averageLen =  CalcTotLabelLens(labels)/CntLabels(labels);
    Drawer(paper,boxes,labels,data,nowstyle,0,averageLen);
}