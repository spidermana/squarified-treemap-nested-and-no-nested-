 
class Remainder{
    #xcoo;
    #ycoo;
    #width;
    #height;
    
    constructor(x,y,width,height){
        this.#xcoo = x;
        this.#ycoo = y;
        this.#width = width;
        this.#height = height;
    }

    shorterEdge(){
        if(this.#width > this.#height){
            return this.#height;
        }else{
            return this.#width;
        }
    }

    saveRectCoordinates(aRow){
        if(aRow.length==0){
            return ;
        }
        var nx = this.#xcoo,ny = this.#ycoo;
        var nAreaArr = [];
        var i = 0;
        var len = aRow.length;
        var delHeight,delWidth;
        if(this.#width > this.#height){ //把height占满了
            delWidth = sumArray(aRow)/this.#height;
            for(i = 0;i<len;i++){
                delHeight = aRow[i]/delWidth;
                nAreaArr.push([nx,ny,nx+delWidth,ny+delHeight]);
                ny = ny + delHeight;
            }
        }else{
            delHeight = sumArray(aRow)/this.#width;
            for(i = 0; i < len;i++){
                delWidth = aRow[i]/delHeight;
                nAreaArr.push([nx,ny,nx+delWidth,ny+delHeight]);
                nx = nx + delWidth;
            }
        }
        return nAreaArr; 
    }

    nextRemainder(aRow){
        var nArea = sumArray(aRow);
        var newRmr;
        if(this.#width > this.#height){ //把height占满了
            var delWidth = nArea/this.#height;
            newRmr = new Remainder(this.#xcoo+delWidth,this.#ycoo,this.#width-delWidth,this.#height);
        }else{
            var delHeight = nArea/this.#width;
            newRmr = new Remainder(this.#xcoo,this.#ycoo+delHeight,this.#width,this.#height-delHeight);
        }
        return newRmr;
    }

}


function sumOneLevelArray(arr){
    var i;
    var len = arr.length;
    var sum=0;
    for(i=0;i<len;i++){
        sum +=arr[i];
    }
    return sum;
}
function isArray(a){
    return a && a.constructor == Array;
}
function sumArray(arrs){
    if(!isArray(arrs)){
        return arrs;
    }
    var i;
    var lens = arrs.length;
    var sum = 0;
    for(i = 0; i < lens; i++){
        if(isArray(arrs[i])){
            sum += sumArray(arrs[i]);
        }else{
            sum += arrs[i];
        }
    }
    return sum;
}
//[1,[2,3,4],1,[[2,3],[6,7,1]]] => 30; allarea = 60;
//[]
function calcArea(data,allArea){ //原始数据，处理成面积
    var areas = [];
    var unitArea = allArea/sumArray(data);
    var i = 0;
    var len = data.length;
    for(i = 0; i < len; i++){
        if(isArray(data[i])){
            areas.push(calcArea(data[i],sumArray(data[i])*unitArea));
        }
        else{
            areas.push(data[i]*unitArea);
        }
    }
    return areas;
}
//[ [[1,2,3],4] , [4,3] , [1,2,3,4], 6 ] => 
function nestedSquarifiedTreemap(mareas,xcoo,ycoo,width,height){    //②
    var treemapCoos = [];
    var tempAreas = [];
    var res = [];
    var needNested = 0;
    var i = 0,j = 0;
    var len = mareas.length;
    if(len == 0)
        return;
    for(i = 0; i < len; i++){
        if(isArray(mareas[i])){
            tempAreas.push(sumArray(mareas[i]));
            needNested = 1;
        }
        else{
            tempAreas.push(mareas[i]);
        }
    }
    console.log("tempAreas",tempAreas);
    treemapCoos = noNestedSquarifiedTreemap(tempAreas,xcoo,ycoo,width,height);
    console.log("treemapCoos",treemapCoos);
    if(needNested){
        for(i = 0; i < len; i++){
            if(isArray(mareas[i])){
                res.push(nestedSquarifiedTreemap(mareas[i],treemapCoos[i][0],treemapCoos[i][1],treemapCoos[i][2]-treemapCoos[i][0],treemapCoos[i][3]-treemapCoos[i][1]));
                /*
                var tempCoos = nestedSquarifiedTreemap(mareas[i],treemapCoos[i][0],treemapCoos[i][1],treemapCoos[i][2]-treemapCoos[i][0],treemapCoos[i][3]-treemapCoos[i][1]);
                for(j=0;j< tempCoos.length;j++){
                    res.push(tempCoos[j]);
                }
                */
                console.log("array_res",res);
            }else{
                res.push(treemapCoos[i]);
                console.log("common_res",res);
            }
        }
        
    }else{
        res = treemapCoos;
    }
    return res;
    
} 
function unfoldSquare(rawTreemaps){
    var res = [];
    var i,j;
    var len=rawTreemaps.length;
    for( i = 0; i< len ; i++){
        var leni = rawTreemaps[i].length;
        for( j = 0; j < leni ; j++){
            res.push(rawTreemaps[i][j]);
        }
    }
    //console.log("rawTreemaps",res);
    return res;
}

function noNestedSquarifiedTreemap(areas,xcoo,ycoo,width,height){
    var remainder  = new Remainder(xcoo,ycoo,width,height);
    var rawTreemaps = squarify(areas,[],remainder,[]);
    return unfoldSquare(rawTreemaps);
}

//calculate Ratios
function worst(row,shorterEdge){
    var min = Math.min.apply(Math,row);
    var max = Math.max.apply(Math,row);
    var sum = sumArray(row);
    return  Math.max(Math.pow(shorterEdge,2)*max/Math.pow(sum,2), Math.pow(sum,2)/(Math.pow(shorterEdge,2)*min));
}

function squarify(areas,nrow,remainder,saver){
    if (areas.length == 0){
        saver.push(remainder.saveRectCoordinates(nrow));
        return;
    }
    var head = areas[0];
    var newRemainder;
    if((nrow.length == 0 && nrow.push(head)) || worst(nrow,remainder.shorterEdge()) > (nrow.push(head),worst(nrow,remainder.shorterEdge()))){
        //console.log("nrow",nrow,nrow.length);
        squarify(areas.slice(1),nrow,remainder,saver);
    }else{
        //pop尾部
        nrow.pop();
        //console.log("pop_nrow",nrow,nrow.length);
        newRemainder = remainder.nextRemainder(nrow);
        saver.push(remainder.saveRectCoordinates(nrow));
        squarify(areas,[],newRemainder,saver);
    }
    //console.log(saver);
    return saver;
}