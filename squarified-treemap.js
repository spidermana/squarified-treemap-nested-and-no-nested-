


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
//[1,[2,3,4],1,[[2,3],[6,7,1]]] => 30;allarea = 60;
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
//[ [[1,2,3],4] , [4,3] , [1,2,3,4] ] => 
function nestedSquarifiedTreemap(mareas,width,height){
    var treemapCoos = [];
    var i = 0;
    var len = mareas.length;
    if(len == 0)
        return;
    for(i = 0; i < len; i++){
        if(isArray(mareas[i])){
            
        }
        else{

        }
    }
}

function noNestedSquarifiedTreemap(areas,width,height){

}
function squarify(areas,){

}